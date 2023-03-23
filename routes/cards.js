const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string()
      .min(4)
      .max(255)
      .pattern(/^(ftp|http|https):\/\/[^ "]+$/)
      .required(),
  }),
}), createCard);
cards.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(4).required(),
  }),
}), deleteCard);
cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), addLike);
cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), removeLike);

module.exports = cards;
