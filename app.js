const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');

const app = express();

// Дописать функции обработчиков

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '63814135535eecdac0ada90e',
  };

  next();
});

app.use(bodyParser.json());
app.use('/users', users);
app.use('/cards', cards);

app.get('/', (req, res) => {
  res.send('<h1>Hello express</h1>');
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  app.listen(PORT, () => {
    console.log(`App works!, port ${PORT}`);
  });
});
