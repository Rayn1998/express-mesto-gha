const Card = require('../models/cards');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (e) {
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).json({ message: 'Введите корректные данные' });
      } else {
        res.status(500).json({ message: 'На сервере произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const id = req.params.id;
  if (id === req.user._id) {
    Card.findByIdAndRemove(id)
      .then((card) => res.send({ data: card }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(404).json({ message: 'Неверный id карточки' });
        } else {
          res.status(500).send({ message: 'На сервере произошла ошибка' });
        }
      });
  } else {
    res.send({ message: 'Можно удалять только собственные карточки' });
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
      res.status(404).send('Карточка не найдена');
    } else {
      res.send('Лайк поставлен');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(400).send('Произошла ошибка: неверная карточка');
    } else {
      res.status(500).send('На сервере произошла ошибка');
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
      res.status(400).send('Произошла ошибка: неверная карточка');
    } else {
      res.status(500).send('На сервере произошла ошибка');
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
