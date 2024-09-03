const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Renamed schema and model to include 'Dist'
const DistProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  batchNo: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  mrp: { type: Number, required: true },
  cost: { type: Number, required: true },
  qty: { type: Number, required: true },
  deliveredDateTemperature: { type: Number }, // Storage temperature if applicable
  rack: { type: String }, // Storage rack location
  distributor: { type: Schema.Types.ObjectId, ref: 'Distributor', required: true }, // Reference to Distributor
  composition: { type: String }, // Composition of the product
});

// Model named with 'Dist' prefix
const DistProduct = mongoose.model('DistProduct', DistProductSchema);

module.exports = DistProduct;
