import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Product from '../../../models/Product';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
  })
  .use(isAuth, isAdmin)
  .post(async (req, res) => {
    await db.connect();
    const product = new Product({
      name: 'sample name ' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const createdProduct = await product.save();
    await db.disconnect();
    res.send({ message: 'Product created.', product: createdProduct });
  });
export default handler;
