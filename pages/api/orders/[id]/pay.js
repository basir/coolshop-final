import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).put(async (req, res) => {
  await db.connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    await db.disconnect();
    res.send({ message: 'Order Paid', order: updatedOrder });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Order Not Found' });
  }
});
export default handler;
