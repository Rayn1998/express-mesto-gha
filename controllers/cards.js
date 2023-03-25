const Card = require('../models/cards');
const BadRequestError = require('../middlewares/BadReqErr');
const NotFoundError = require('../middlewares/NotFoundErr');
const ForbiddenError = require('../middlewares/ForbiddenErr');
const BadAuthError = require('../middlewares/BadAuthErr');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (err) {
    next(err);
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
        const error = new BadRequestError('Введите корректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (req.user._id !== card.owner.valueOf()) {
        throw new ForbiddenError(
          'Вы не можете удалить карточку другого пользователя',
        );
      }
      card.deleteOne().then(() => {
        res.status(200).send({ message: 'Карточка успешно удалена' });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadAuthError('Введён некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

const addLike = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const handleLike = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!handleLike) {
      next(new NotFoundError('Карточка не найдена'));
    } else {
      res.send('Лайк поставлен');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError('Произошла ошибка: неверная карточка'));
    } else {
      next(e);
    }
  }
};

const removeLike = async (req, res, next) => {
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
      next(new BadRequestError('Произошла ошибка: неверная карточка'));
    } else {
      next(e);
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
