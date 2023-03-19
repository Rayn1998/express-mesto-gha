const jwt = require('jsonwebtoken');
const { handleError } = require('./error');

const auth = async (req, res, next) => {
  const token = req.body.Authorization;
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (data._id) {
        req.user = data;
        next();
      }
    });
  } catch (err) {
    handleError(res, 401, { message: 'Пользователь не авторизован' });
  }
};

module.exports = { auth };
