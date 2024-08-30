const mongoose = require('mongoose');

const retailOrderSchema = new mongoose.Schema({
  pharmacyName: {
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
  buyingPrice: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    required: true
  },
  distributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Distributor', // Assuming you have a Distributor model
    required: true
  },
  feedback: {
    type: String
  }
});

const RetailOrder = mongoose.model('RetailOrder', retailOrderSchema);

module.exports = RetailOrder;
