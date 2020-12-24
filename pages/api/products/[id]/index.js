import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler
  .use(isAuth)
  .get(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    await db.disconnect();
    res.send(product);
  })
  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
      const deletedProduct = await product.remove();
      await db.disconnect();
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
  .use(isAuth, isAdmin)
  .put(async (req, res) => {
    await db.connect();
    const product = await Product.findById(req.query.id);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.name = req.body.name;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      await db.disconnect();
      res.send({ message: 'Product Deleted', product: updatedProduct });
    } else {
      await db.disconnect();
      res.status(404).send({ message: 'Product Not Found' });
    }
  });
export default handler;
