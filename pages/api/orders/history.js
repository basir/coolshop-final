import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Order from '../../../models/Order';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth, isAdmin).get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({}).lean();
  await db.disconnect();
  res.send(orders);
});
export default handler;
