const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { authorization } = require('./middlewares/auth');
require('dotenv').config();

const app = express();

const { PORT = 3000 } = process.env;

// app.use((req, res, next) => {
//   req.user = {
//     _id: '63814135535eecdac0ada90e',
//   };

//   next();
// });

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(authorization);
app.use('/users', users);
app.use('/cards', cards);
// app.post('/signin', authorization);

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
