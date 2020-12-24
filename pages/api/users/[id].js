import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import Order from '../../../models/Order';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';

const handler = nextConnect();

handler
  .use(isAuth)
  .get(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    await db.disconnect();
    res.send(user);
  })
  .use(isAuth, isAdmin)
  .put(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      await user.save();
      await db.disconnect();
      res.status(200).json({
        success: true,
      });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'User not found' });
    }
  })
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      if (user.isAdmin) {
        res.status(400).send({ message: "Admin can't be deleted" });
      }

      const orders = await Order.find({ user: user._id });
      if (orders.length > 0) {
        res
          .status(400)
          .send({ message: "Can't delete a user that has orders" });
      }
      const deletedUser = await user.remove();
      await db.disconnect();
      res.send({ message: 'User Deleted', user: deletedUser });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'User Not Found' });
    }
  });
export default handler;
