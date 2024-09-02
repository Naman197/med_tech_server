const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  distributor: {
    distributorId: { type: Schema.Types.ObjectId, ref: 'Distributor', required: true }, // Reference to Distributor
    name: { type: String } // Name of the distributor (for convenience)
  },
  manufacturer: {
    manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true }, // Reference to Manufacturer
    name: { type: String } // Name of the manufacturer (for convenience)
  },
  medicines: [
    {
      name: { type: String, required: true }, // Medicine name
      qty: { type: Number, required: true }, // Quantity ordered
      manufacturerId: { type: Schema.Types.ObjectId, ref: 'ManufacturerProduct' }, // Reference to ManufacturerProduct
      batchNo: { type: String },
      mrp: { type: Number },
      cost: { type: Number },
      productionDate: { type: Date },
      expiryDate: { type: Date },
      composition: [
        {
          ingredient: { type: String },
          quantity: { type: String }
        }
      ],
      temperature: { type: String } // Storage temperature of the medicine
    }
  ],
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Failed','Success'], default: 'Pending' }, // Added 'Failed'
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }, // Payment status
  paymentDetails: {
    transactionId: { type: String },
    paymentDate: { type: Date }
  },
  boxNo: { type: String },
  qrCode: { type: String },
  
  billingDetails: {
    totalAmount: { type: Number }, // Total amount of the order
    invoiceNumber: { type: String, unique: true }, // Unique invoice number
    billingPdf: { type: String }, // Path or URL to the billing PDF
    billingDate: { type: Date, default: Date.now } // Date of the invoice/billing
  },
  feedback: {
    comment: { type: String }, // Feedback comment from the distributor
    rating: {
        type: String,
        enum: [
            'Very Poor',   // 1
            'Poor',        // 2
            'Neutral',     // 3
            'Good',        // 4
            'Excellent'    // 5
        ],
        default: 'Neutral' // Default rating
    },
    feedbackDate: { type: Date, default: Date.now } // Date when feedback was provided
},
orderType: { 
    type: String, 
    enum: ['Placed', 'Returned'], 
  } 
}, { timestamps: true }
);



const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
