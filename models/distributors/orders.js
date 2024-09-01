const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: 'Manufacturer', // Assuming you have a Manufacturer model
    required: true
  },
  distributor: {
    type: Schema.Types.ObjectId,
    ref: 'Distributor', // Assuming you have a Distributor model
    required: true
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  medicines: [
    {
      name: { type: String, required: true },
      category: { type: String, required: true },
      batchNo: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      mrp: { type: Number, required: true }, // Maximum Retail Price
      cost: { type: Number, required: true }, // Cost to manufacture
      composition: [
        {
          ingredient: { type: String },
          quantity: { type: String } // Quantity or proportion of the ingredient
        }
      ],
      temperature: { type: Number }, // Storage temperature if applicable
      quantity: { type: Number, required: true },
      totalPrice: { type: Number, required: true }, // Total price for this medicine
      barcode: { type: String, required: true } // Barcode number
    }
  ],
  qrCode: { type: String }, // QR code (can be a URL or base64 encoded image)
  totalAmount: { type: Number, required: true } // Total amount for the order
});

// Create and export the model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
