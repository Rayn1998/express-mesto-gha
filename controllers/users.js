const User = require('../models/users');

// function userUpdate(args) {
//   User.updateOne({ ...args }, { new: true });
// }

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
  const { id } = req.params;
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
  const { name, about, avatar } = req.body;
  try {
    const user = User.updateOne({ name, about, avatar }, { new: true });
    return res.status(201).send({ data: user });
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  refreshProfile,
  refreshAvatar,
};
