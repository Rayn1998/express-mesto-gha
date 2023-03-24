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
  }
  return null;
};

const getMe = async (req, res, next) => {
  const id = req.user?._id;
  try {
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(err);
    } else {
      handleError(err, req, res, next);
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
    } else {
      handleError(err, req, res, next);
    }
  }
  return null;
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
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
      });
  });
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
    } else {
      handleError(err, req, res, next);
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
    } else {
      handleError(err, req, res, next);
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
