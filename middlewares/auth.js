const jwt = require('jsonwebtoken');
// const { handleError } = require('./error');

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
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
