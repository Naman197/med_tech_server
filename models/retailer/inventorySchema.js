const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  batchNo: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  stockStatus: {
    type: String,
    enum: ['In Stock', 'Out of Stock'],
    required: true
  },
  demand: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  orderNow: {
    type: Boolean,
    default: false
  },
  trackOrder: {
    type: String
  },
  lastOrderDate: {
    type: Date
  },
  barcodeId: {
    type: String,
    unique: true
  },
  discount: {
    type: Number,
    default: 0
  },
  rack: {
    type: String
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
