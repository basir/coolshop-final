export const getResponseError = (error) =>
  error.response && error.response.data.message
    ? error.response.data.message
    : error.message;

export const onError = (err, req, res, next) => {
  res.status(500).send({ message: err.toString() });
};
