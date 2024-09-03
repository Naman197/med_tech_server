const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the QR Code Schema
const QRCodeSchema = new Schema({
  qrCode: { type: String, unique: true, required: true }, // QR code value
  location: { type: String, required: true }, // Location where the QR code is used
  number: { type: String, required: true }, // QR code number or identifier
  condition: { 
    type: String,
    enum: ['New', 'Used', 'Damaged'], // Conditions of the QR code
    default: 'New' // Default condition
  },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, // Reference to an Order
  createdAt: { type: Date, default: Date.now } // Timestamp of when the QR code was created
});

// Create and export the model
const QRCode = mongoose.model('QRCode', QRCodeSchema);
module.exports = QRCode;
