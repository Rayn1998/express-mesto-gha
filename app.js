const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Joi, celebrate, errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser, getUsers } = require('./controllers/users');
const { getCards } = require('./controllers/cards');
const { auth } = require('./middlewares/auth');
// require('dotenv').config();
const NotFoundError = require('./middlewares/NotFoundErr');

process.env.ACCESS_TOKEN_SECRET = 'default_key';

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(2).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(ftp|http|https):\/\/[^"]+\.\w{2,}/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.get('/cards', getCards);
app.get('/users', getUsers);
app.use('/users', auth, users);
app.use('/cards', auth, cards);

app.use(errors());

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'На сервере произошла ошибка';
  res.status(err.statusCode).send({ message: err.message });
  next();
});

mongoose.connect(
  'mongodb://127.0.0.1:27017/mestodb',
  {
    useNewUrlParser: true,
  },
  () => {
    app.listen(PORT, () => {
      console.log(`App works!, port ${PORT}`);
    });
  },
);
