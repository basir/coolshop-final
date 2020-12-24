import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Order from '../../../../models/Order';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler
  .use(isAuth)
  .get(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    await db.disconnect();
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    if (order) {
      const deletedOrder = await order.remove();
      await db.disconnect();
      res.send({ message: 'Order Deleted', order: deletedOrder });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Order Not Found' });
    }
  });
export default handler;
