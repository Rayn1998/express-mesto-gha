const jwt = require('jsonwebtoken');
const BadAuthError = require('./BadAuthErr');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(new BadAuthError('Пользователь не авторизован'));
    return;
  }
  const token = await req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret');
  } catch (e) {
    next(new BadAuthError('Пользователь не авторизован'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
