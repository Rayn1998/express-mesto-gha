const Card = require('../models/cards');
const { handleError } = require('../middlewares/error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (err) {
    handleError(err, req, res, next);
    // handleError(res, 500, { message: 'На сервере произошла ошибка' });
  }
  return null;
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handleError(err, req, res, next);
        // handleError(res, 400, { message: 'Введите корректные данные' });
      } else {
        handleError(err, req, res, next);
        // handleError(res, 500, { message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id).then((result) => req.user._id === result.owner.valueOf())
    .then((condition) => {
      if (condition) {
        Card.findByIdAndRemove(id)
          .then((card) => {
            res.send({ data: card });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              handleError(err, req, res, next);
              // handleError(res, 404, { message: 'Неверный id карточки' });
            } else {
              handleError(err, req, res, next);
              // handleError(res, 500, { message: 'На сервере произошла ошибка' });
            }
          });
      } else return new Error();
      // {
      //   handleError(err, req, res, next);
      // handleError(res, 403, { message: 'Можно удалять только собственные карточки' });
      // }
      return null;
    }).catch((err) => {
      err.statusCode = 403;
      err.message = 'Можно удалять только собственные карточки';
      handleError(err, req, res, next);
    });
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
