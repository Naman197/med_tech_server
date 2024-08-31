const mongoose = require('mongoose');

// Define the returned items schema
const returnedItemsSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  returnReason: {
    type: String,
    required: true
  },
  returnDate: {
    type: Date,
    default: Date.now // Automatically sets the return date to the current date
  }
});

// Main retail order schema with the returned items embedded
const retailOrderSchema = new mongoose.Schema({
  medicineName: {
    type: String,
    required: true
  },
  orderFormId: {
    type: String,
    required: true,
    unique: true
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
    ref: 'Distributor',
    required: true
  },
  totalQuantity: {
    type: Number,
    required: true
  },
  returnedItems: [returnedItemsSchema], // Embedded schema to track returned items
  refundStatus: {
    type: String,
    enum: ['None', 'Partial', 'Full'],
    default: 'None'
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feedback'
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  refundDate: {
    type: Date,
    default: null
  },
  retailUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RetailUser', // Reference to the RetailUser schema
    required: true
  }
});

const RetailOrder = mongoose.model('RetailOrder', retailOrderSchema);

module.exports = RetailOrder;
