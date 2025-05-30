const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testapp1');

const userSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  email: String,
});

module.exports = mongoose.model('User', userSchema);