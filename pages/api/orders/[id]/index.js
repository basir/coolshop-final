import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import { dbConnect, dbDisconnect } from '../../../../utils/db';
import Order from '../../../../models/Order';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler
  .use(isAuth)
  .get(async (req, res) => {
    await dbConnect();
    const order = await Order.findById(req.query.id);
    await dbDisconnect();
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await dbConnect();
    const order = await Order.findById(req.query.id);
    if (order) {
      const deletedOrder = await order.remove();
      await dbDisconnect();
      res.send({ message: 'Order Deleted', order: deletedOrder });
    } else {
      await dbDisconnect();
      res.status(404).send({ message: 'Order Not Found' });
    }
  });
export default handler;
