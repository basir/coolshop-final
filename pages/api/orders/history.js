import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import { dbConnect, dbDisconnect } from '../../../utils/db';
import Order from '../../../models/Order';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth, isAdmin).get(async (req, res) => {
  await dbConnect();
  const orders = await Order.find({}).lean();
  await dbDisconnect();
  res.send(orders);
});
export default handler;
