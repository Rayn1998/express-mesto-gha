const users = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  refreshProfile,
  refreshAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getUser);
// users.get('/me', getUser);
// users.post('/', createUser);
users.patch('/me', refreshProfile);
users.patch('/me/avatar', refreshAvatar);
users.get('/:id', getUser);

module.exports = users;
