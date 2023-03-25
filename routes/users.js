const users = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUser,
  getMe,
  refreshProfile,
  refreshAvatar,
} = require('../controllers/users');

users.get('/me', getMe);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), refreshProfile);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(ftp|http|https):\/\/[^ "]+$/).required(),
  }),
}), refreshAvatar);
users.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);

users.use(errors());

module.exports = users;
