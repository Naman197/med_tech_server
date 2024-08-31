const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerProductSchema = new Schema({
  name: { type: String },
  category: { type: String },
  batchNo: { type: String },
  expiryDate: { type: Date },
  mrp: { type: Number }, 
  cost: { type: Number },
  qty: { type: Number }, 
  productionDate: { type: Date },
  qualityCheck: { type: Boolean }, 
  qualityCheckImages: [{ type: String }], 
  machineNo: { type: String },
  demand: { type: Number }, 
  barcode: { type: String, unique: true },
  composition: [
    {
      ingredient: { type: String },
      quantity: { type: String }
    }
  ]
});

// Create and export the model
const ManufacturerProduct = mongoose.model('ManufacturerProduct', ManufacturerProductSchema);
module.exports = ManufacturerProduct;
