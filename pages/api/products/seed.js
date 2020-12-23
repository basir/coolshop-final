import nextConnect from 'next-connect';
import User from '../../../models/User';
import { onError } from '../../../utils/error';
import { dbConnect, dbDisconnect } from '../../../utils/db';
import data from '../../../utils/data';
import Product from '../../../models/Product';

const handler = nextConnect({
  onError,
});
handler.get(async (req, res) => {
  await dbConnect();
  const createdProducts = await Product.insertMany(data.products);
  await dbDisconnect();
  res.send({ createdProducts });
});
export default handler;
