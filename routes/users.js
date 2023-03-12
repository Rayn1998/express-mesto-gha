const users = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  refreshProfile,
  refreshAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.post('/', createUser);
users.patch('/me', refreshProfile);
users.patch('/me/avatar', refreshAvatar);
users.get('/:id', getUser);

module.exports = users;
