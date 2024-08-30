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
  },
  role: { // New field for user roles
    type: String,
    enum: ['admin', 'retailer'], // Define allowed roles
    default: 'retailer' // Default role
  }
});

const RetailUser = mongoose.model('RetailUser', retailUserSchema);

module.exports = RetailUser;
