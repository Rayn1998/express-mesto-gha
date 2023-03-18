const jwt = require('jsonwebtoken');

const authorization = async (req, res, next) => {
    const token = req.body.Authorization;
    let payload;
    try {
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (data._id) {
                req.user = data;
                next();
            }  else {
                return
            }
        });
    } catch (err) {
        res.send({ message: 'Пользователь не авторизован' });
    }
}

module.exports = { authorization };