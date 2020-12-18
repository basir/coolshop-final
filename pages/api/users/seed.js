import nextConnect from 'next-connect';
import User from '../../../models/User';
import { onError } from '../../../utils/error';
import { dbConnect } from '../../../utils/db';
import data from '../../../utils/data';

const handler = nextConnect({
  onError,
});
handler.get(async (req, res) => {
  await dbConnect();
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
});
export default handler;
