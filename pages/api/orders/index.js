import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import { dbConnect } from '../../../utils/db';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.use(isAuth).post(async (req, res) => {
  await dbConnect();
  if (req.body.cartItems.length === 0) {
    res.status(400).send({ message: 'Cart is empty' });
  } else {
    const order = new Order({
      orderItems: req.body.cartItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  }
});
export default handler;
