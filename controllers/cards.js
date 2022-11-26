const Card = require('../models/cards');

const getCards = async (req, res) => {
  const cards = await Card.find({});
  return res.status(200).json(cards);
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const addLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const like = await Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  );
  if (like) {
    res.send('Лайк поставлен');
  } else {
    res.send('Произошла ошибка');
  }
};

const removeLike = async (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const disLike = await Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  );
  if (disLike) {
    res.send('Лайк снят');
  } else {
    res.send('Произошла ошибка');
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
