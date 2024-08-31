const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistributorSchema = new Schema({
  fullName: { type: String },
  organizationName: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  phoneNumber: {
    countryCode: { type: String },
    number: { type: String }
  },
  password: { type: String, required: true },
  
  role: { type: String, default: 'Distributor' },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  securityQuestion: { type: String },
  securityAnswer: { type: String },
  captchaVerification: { type: Boolean },
  distributorId: { type: String, unique: true },
  licenseNumber: { type: String },
  warehouseLocations: [{ type: String }], // e.g., ["Location 1", "Location 2"]
  vehicleFleetDetails: {
    vehicleType: { type: String },
    quantity: { type: Number }
  },
  regionsCovered: [{ type: String }], // e.g., ["Region 1", "Region 2"]
  preferredShippingMethod: { type: String }, // e.g., "Air", "Road", "Sea"
  alternateContactInformation: {
    fullName: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String }
  },
  uploadedDocuments: [{ type: String }], // URLs or paths to uploaded documents
  agreeToTermsAndConditions: { type: Boolean }
});

module.exports = mongoose.model('Distributor', DistributorSchema);
