import nextConnect from 'next-connect';
import User from '../../../models/User';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nextConnect();

handler.use(isAuth, isAdmin).get(async (req, res) => {
  await db.connect();
  const users = await User.find();
  await db.disconnect();
  res.send(users);
});

export default handler;
