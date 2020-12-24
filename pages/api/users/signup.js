import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { signToken } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';

const handler = nextConnect({
  onError,
});
handler.post(async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  await db.connect();
  const createdUser = await user.save();
  await db.disconnect();
  if (createdUser) {
    const token = signToken(createdUser);
    res.status(200).json({
      success: true,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: token,
    });
  } else {
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});
export default handler;
