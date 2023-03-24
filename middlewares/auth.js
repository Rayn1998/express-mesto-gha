const jwt = require('jsonwebtoken');

const auth = async (err, req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  console.log(token);
  try {
    // process.env.ACCESS_TOKEN_SECRET
    jwt.verify(token, 'default', (err, data) => {
      if (data._id) {
        req.user = data;
        next();
      }
    });
  } catch (e) {
    const err = new Error('Пользователь не авторизован');
    err.statusCode = 401;

    next(err);
  }
};

module.exports = { auth };
