const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Updated schema without 'required: true' for fields
const DistProductSchema = new Schema({
  name: { type: String },
  category: { type: String },
  batchNo: { type: String },
  expiryDate: { type: Date },
  mrp: { type: Number },
  cost: { type: Number },
  qty: { type: Number },
  deliveredDateTemperature: { type: Number }, // Storage temperature if applicable
  rack: { type: String }, // Storage rack location
  distributor: { type: Schema.Types.ObjectId, ref: 'Distributor' },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' }, // Reference to Manufacturer
  composition: [
    {
      ingredient: { type: String },
      quantity: { type: String }
    }
  ],
 sellingPrice: { type: Number }, // Selling price of the product
  margin: { type: Number } // Profit margin on the product
});

// Model named with 'Dist' prefix
const DistProduct = mongoose.model('DistProduct', DistProductSchema);

module.exports = DistProduct;
