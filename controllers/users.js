const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    res.status(500).json({ message: 'На сервере произошла ошибка' });
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
      res.status(404).json({ message: 'Пользователь не найден' });
    } else {
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    }
  }
  return null;
};

const createUser = async (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  console.log(req);
  try {
    bcrypt.hash(password, 10).then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => res.status(400).send(err)),
    );
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    }
  }
  return null;
};

const refreshProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.updateOne({ name, about }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ message: 'Произошла ошибка обновления профиля' });
    } else {
      res.status(500).json({ message: 'На сервере произошла ошибка' });
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
      res.status(400).json({ message: 'Произошла ошибка обновления профиля' });
    } else {
      res.status(500).json({ message: 'На сервере произошла ошибка' });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({email}).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      if (bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
          res.json({ _id: user._id, jwt: token });
        } else {
          res.status(401).send({ message: 'Неправильные почта или пароль' });
        }
      }));
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
