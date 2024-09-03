// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const ManufacturerProductSchema = new Schema({
//   name: { type: String },
//   category: { type: String },
//   batchNo: { type: String },
//   expiryDate: { type: Date },
//   mrp: { type: Number }, 
//   cost: { type: Number },
//   qty: { type: Number }, 
//   productionDate: { type: Date },
//   qualityCheck: { type: Boolean }, 
//   qualityCheckImages: [{ type: String }], 
//   machineNo: { type: String },
//   demand: { type: Number }, 
//   barcode: { type: String, unique: true },
//   composition: [
//     {
//       ingredient: { type: String },
//       quantity: { type: String }
//     }
//   ],
//   temperature: { type: Number }, // Storage temperature if applicable
//   rack: { type: String } // Added rack field
// });

// // Create and export the model
// const ManufacturerProduct = mongoose.model('ManufacturerProduct', ManufacturerProductSchema);
// module.exports = ManufacturerProduct;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerProductSchema = new Schema({
  name: { type: String },
  category: { type: String },
  batchNo: { type: String },
  expiryDate: { type: Date },
  mrp: { type: Number }, 
  cost: { type: Number },
  sellingPrice: { type: Number }, 

  qty: { type: Number }, 
  productionDate: { type: Date },
  qualityCheck: { type: Boolean }, 
  qualityCheckImages: [
    {
      type: { type: String }, // 'image' or 'pdf'
      url: { type: String }
    }
  ],
    machineNo: { type: String },
  demand: { type: Number }, 
  barcode: { type: String, unique: true },
  composition: [
    {
      ingredient: { type: String },
      quantity: { type: String }
    }
  ],
  temperature: { type: Number }, // Storage temperature if applicable
  rack: { type: String }, // Storage rack location
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true } // Reference to Manufacturer
});

// Create and export the model
const ManufacturerProduct = mongoose.model('ManufacturerProduct', ManufacturerProductSchema);
module.exports = ManufacturerProduct;
