import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import { dbConnect, dbDisconnect } from '../../../../utils/db';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).put(async (req, res) => {
  await dbConnect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    await dbDisconnect();
    res.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    await dbDisconnect();
    res.status(404).send({ message: 'Order Not Found' });
  }
});
export default handler;
