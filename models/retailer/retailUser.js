const mongoose = require('mongoose');

const retailUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const RetailUser = mongoose.model('RetailUser', retailUserSchema);

module.exports = RetailUser;
