const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
require('dotenv').config();
const { Joi, celebrate } = require('celebrate');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', celebrate({}), createUser);
app.use('/users', auth, users);
app.use('/cards', auth, cards);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
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
