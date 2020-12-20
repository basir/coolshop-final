import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import { dbConnect } from '../../../utils/db';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).get(async (req, res) => {
  await dbConnect();
  const order = await Order.findById(req.query.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});
export default handler;
