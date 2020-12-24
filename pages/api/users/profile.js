import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { isAuth, signToken } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    await db.disconnect();
    const token = signToken(updatedUser);
    res.status(200).json({
      success: true,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: token,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found' });
  }
});
export default handler;
