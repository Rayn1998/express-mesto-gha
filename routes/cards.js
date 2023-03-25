const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .pattern(/^(ftp|http|https):\/\/[^"]+\.\w{2,}/)
      .required(),
  }),
}), createCard);
cards.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addLike);
cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), removeLike);

module.exports = cards;
