import { dbDisconnect } from './db';

export const getResponseError = (error) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message;

export const onError = async (err, req, res, next) => {
  await dbDisconnect();
  res.status(500).send({ message: err.toString() });
};
