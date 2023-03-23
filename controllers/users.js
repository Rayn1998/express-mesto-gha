const Error = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { handleError } = require('../middlewares/error');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    handleError(err, req, res, next);
    // { message: 'На сервере произошла ошибка' }
  }
  return null;
};

const getMe = async (req, res, next) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      handleError(err, req, res, next);
      // handleError(res, 404, { message: 'Пользователь не найден' });
    } else {
      handleError(err, req, res, next);
      // handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
  return null;
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      handleError(err, req, res, next);
      // handleError(res, 404, { message: 'Пользователь не найден' });
    } else {
      handleError(err, req, res, next);
      // handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
  return null;
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // User.findOne({ email }).exec()
  //   .then((result) => {
  //     if (result) {
  //       const err = Error;
  //       err.statusCode = 409;
  //       err.message = 'Пользователь с таким email уже зарегистрирован';
  //       handleError(err, req, res, next);
  //       // handleError(res, 409, { message: 'Пользователь с таким email уже зарегистрирован' });
  //     } else {
  //       try {
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.status(201).send({ data: user }))
      .catch((e) => {
        const err = Error;
        if (e.name === 'ValidationError') {
          err.statusCode = 400;
          err.message = 'Введены некорректные данные';
          handleError(err, req, res, next);
        } else if (e.code === 11000) {
          err.statusCode = 409;
          err.message = 'Пользователь с таким email уже зарегистрирован';
          handleError(err, req, res, next);
        } else {
          next(err);
        }
        // handleError(res, 500, { message: 'На сервере произошла ошибка' }
      });
  });
  //     } catch (err) {

  //         // handleError(res, 400, { message: 'Введены некорректные данные' });
  //       } else {
  //         handleError(err, req, res, next);
  //         // handleError(res, 500, { message: 'На сервере произошла ошибк' });
  //       }
  //     }
  //   }
  // });
  return null;
};

const refreshProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = 400;
      err.message = 'Произошла ошибка обновления профиля';
      handleError(err, req, res, next);
      // handleError(res, 400, { message: 'Произошла ошибка обновления профиля' });
    } else {
      handleError(err, req, res, next);
      // handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

const refreshAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const userAvatar = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    res.status(200).send(userAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.statusCode = 400;
      err.message = 'Произошла ошибка обновления профиля';
      handleError(err, req, res, next);
      // handleError(res, 400, { message: 'Произошла ошибка обновления профиля' });
    } else {
      handleError(err, req, res, next);
      // handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next('Неправильные почта или пароль');
        // { message: 'Неправильные почта или пароль' }
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
            next();
            // handleError(401, 'Неправильные почта или пароль');
            // throw new BadRequestError('Неправильные почта или пароль');
            // handleError(res, 401, { message: 'Неправильные почта или пароль' });
          }
        })
      );
    })
    .catch(() => {
      handleError(401, 'Неправильные почта или пароль');
    });
};

module.exports = {
  getUsers,
  getUser,
  getMe,
  createUser,
  refreshProfile,
  refreshAvatar,
  login,
};
