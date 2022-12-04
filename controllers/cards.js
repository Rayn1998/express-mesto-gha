const Card = require('../models/cards');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Произошла ощибка' });
  }
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err._message === 'cards validation failed') {
        res.status(400).json({ message: 'Введите корректные данные' });
      } else {
        res.status(500).json({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).json({ message: 'Неверный id карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const addLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const like = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (like) {
      res.send('Лайк поставлен');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(400).send('Произошла ошибка: неверная карточка');
    } else {
      res.status(500).send('Произошла ошибка');
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
      res.status(500).send('Произошла ошибка');
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
