const Card = require('../models/cards');
const { handleError } = require('../middlewares/error');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (e) {
    handleError(res, 500, { message: 'На сервере произошла ошибка' });
  }
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handleError(res, 400, { message: 'Введите корректные данные' });
      } else {
        handleError(res, 500, { message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { id } = req.params;
  if (id === req.user._id) {
    Card.findByIdAndRemove(id)
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'CastError') {
          handleError(res, 404, { message: 'Неверный id карточки' });
        } else {
          handleError(res, 500, { message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    handleError(res, 403, { message: 'Можно удалять только собственные карточки' });
  }
};

const addLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const handleLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!handleLike) {
      handleError(res, 404, { message: 'Карточка не найдена' });
    } else {
      res.send('Лайк поставлен');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      handleError(res, 400, { message: 'Произошла ошибка: неверная карточка' });
    } else {
      handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

const removeLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const disLike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (disLike) {
      res.send('Лайк снят');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      handleError(res, 400, { message: 'Произошла ошибка: неверная карточка' });
    } else {
      handleError(res, 500, { message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
