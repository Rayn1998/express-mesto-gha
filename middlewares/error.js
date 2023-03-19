const handleError = (
  res,
  statusCode,
  message,
) => {
  res.status(statusCode).send(message);
};

module.exports = { handleError };
