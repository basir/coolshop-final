import nextConnect from 'next-connect';
import User from '../../../models/User';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import data from '../../../utils/data';

const handler = nextConnect({
  onError,
});
handler.get(async (req, res) => {
  await db.connect();
  const createdUsers = await User.insertMany(data.users);
  await db.disconnect();
  res.send({ createdUsers });
});
export default handler;
