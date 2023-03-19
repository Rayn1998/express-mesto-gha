const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { handleError } = require('../middlewares/error');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    handleError(res, 500, { message: 'На сервере произошла ошибка' });
  }
  return null;
};

const getUser = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      handleError(res, 404, { message: 'Пользователь не найден' });
    } else {
      handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
  return null;
};

const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email }).exec()
    .then((result) => {
      if (result) {
        handleError(res, 409, { message: 'Пользователь с таким email уже зарегистрирован' });
      } else {
        try {
          bcrypt.hash(password, 10).then((hash) => {
            User.create({
              name,
              about,
              avatar,
              email,
              password: hash,
            })
              .then((user) => res.status(201).send({ data: user }))
              .catch(() => handleError(res, 500, { message: 'На сервере произошла ошибка' }));
          });
        } catch (err) {
          if (err.name === 'ValidationError') {
            handleError(res, 400, { message: 'Введены некорректные данные' });
          } else {
            handleError(res, 500, { message: 'На сервере произошла ошибк' });
          }
        }
      }
    });
  return null;
};

const refreshProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.updateOne({ name, about }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      handleError(res, 400, { message: 'Произошла ошибка обновления профиля' });
    } else {
      handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

const refreshAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const userAvatar = await User.updateOne({ avatar }, { new: true });
    res.status(200).json(userAvatar);
  } catch (err) {
    if (err.name === 'CastError') {
      handleError(res, 400, { message: 'Произошла ошибка обновления профиля' });
    } else {
      handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        handleError(res, 401, { message: 'Неправильные почта или пароль' });
      }
      if (
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '7d' },
            );
            res.json({ _id: user._id, jwt: token });
          } else {
            handleError(res, 401, { message: 'Неправильные почта или пароль' });
          }
        })
      );
    })
    .catch(() => {
      handleError(res, 401, { message: 'Неправильные почта или пароль' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  refreshProfile,
  refreshAvatar,
  login,
};
