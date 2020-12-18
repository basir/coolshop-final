import nextConnect from 'next-connect';
import { isAuth } from '../../../utils/auth';

const handler = nextConnect();

handler.use(isAuth).get(async (req, res) => {
  res.send(`Users`);
});
export default handler;
