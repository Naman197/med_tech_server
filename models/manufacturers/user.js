const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManufacturerSchema = new Schema({
  fullName: { type: String },
  organizationName: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  phoneNumber: {
    countryCode: { type: String },
    number: { type: String }
  },
  password: { type: String, required: true },
  
  role: { type: String, default: 'Manufacturer' },
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
  supplierId: { type: String, unique: true },
  businessRegistrationNumber: { type: String },
  typeOfProductsSupplied: [{ type: String }], // e.g., ["Pharmaceuticals", "Medical Devices"]
  licenseNumber: { type: String },
  yearsInOperation: { type: Number },
  preferredPaymentMethod: { type: String }, // e.g., "Bank Transfer", "Credit Card"
  bankAccountDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String }
  },
  alternateContactInformation: {
    fullName: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String }
  },
  uploadedDocuments: [{ type: String }], // URLs or paths to uploaded documents
  agreeToTermsAndConditions: { type: Boolean }
});

module.exports = mongoose.model('Manufacturer', ManufacturerSchema);
