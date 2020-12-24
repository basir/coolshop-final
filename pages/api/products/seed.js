import nextConnect from 'next-connect';
import User from '../../../models/User';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import data from '../../../utils/data';
import Product from '../../../models/Product';

const handler = nextConnect({
  onError,
});
handler.get(async (req, res) => {
  await db.connect();
  const createdProducts = await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ createdProducts });
});
export default handler;
