import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import { onError } from '../../../utils/error';
import { signToken } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});
handler.post(async (req, res) => {
  const signedinUser = await User.findOne({
    email: req.body.email,
  });
  if (
    signedinUser &&
    bcrypt.compareSync(req.body.password, signedinUser.password)
  ) {
    const token = signToken(signedinUser);
    res.status(200).json({
      success: true,
      name: signedinUser.name,
      email: signedinUser.email,
      isAdmin: signedinUser.isAdmin,
      token: token,
    });
  } else {
    res.status(401).send({ message: 'Invalid User or Password' });
  }
});
export default handler;
