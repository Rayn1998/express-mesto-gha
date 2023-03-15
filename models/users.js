const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    monlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    monlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /^(ftp|http|https):\/\/[^ "]+$/.test(url),
      message: 'link is incorrect',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
