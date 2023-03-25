const jwt = require('jsonwebtoken');
const BadAuthError = require('./BadAuthErr');

const auth = async (req, res, next) => {
  const token = await req.headers.authorization;
  if (!token) {
    next(new BadAuthError('Пользователь не авторизован'));
  } else {
    token.replace('Bearer ', '');
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (e) {
    next(new BadAuthError('Пользователь не авторизован'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
