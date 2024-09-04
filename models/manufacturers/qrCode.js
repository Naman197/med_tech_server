const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the QR Code Schema
const QRCodeSchema = new Schema({
  qrCode: { type: String, unique: true }, // QR code value
  location: { type: String }, // Location where the QR code is used
  number: { type: String }, // QR code number or identifier
  condition: { 
    type: String,
    enum: ['New', 'Used', 'Damaged', 'Pending'], // Conditions of the QR code
    default: 'Pending' // Default condition is 'Pending' before finalizing
  },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' }, // Reference to an Order
  distributorId: { type: Schema.Types.ObjectId, ref: 'Distributor' }, // Reference to a Distributor
  manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  qrCodeUrl: { type: String }, // URL of the generated QR code image
  accessDate: { type: Date }, // Date when the QR code was accessed
  boxImage: { type: String }, // URL of the box image
  createdAt: { type: Date, default: Date.now }, // Timestamp of when the QR code was created
  updatedAt: { type: Date, default: Date.now } // Timestamp of the last update
});

// Middleware to update the `updatedAt` field on save
QRCodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the model
const QRCode = mongoose.model('QRCode', QRCodeSchema);
module.exports = QRCode;
