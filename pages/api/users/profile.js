import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { signToken } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import { dbConnect, dbDisconnect } from '../../../utils/db';

const handler = nextConnect({
  onError,
});
handler.put(async (req, res) => {
  await dbConnect();
  const user = await User.findOne({
    email: req.body.email,
  });

  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    await dbDisconnect();
    const token = signToken(updatedUser);
    res.status(200).json({
      success: true,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: token,
    });
  } else {
    await dbDisconnect();
    res.status(404).send({ message: 'User not found' });
  }
});
export default handler;
