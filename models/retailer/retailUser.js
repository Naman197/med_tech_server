// const mongoose = require('mongoose');

// const retailUserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   uniqueId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: { // New field for user roles
//     type: String,
//     enum: ['admin', 'retailer'], // Define allowed roles
//     default: 'retailer' // Default role
//   }
// });

// const RetailUser = mongoose.model('RetailUser', retailUserSchema);

// module.exports = RetailUser;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const retailUser = new Schema({
  fullName: { type: String },
  organizationName: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  phoneNumber: {
    countryCode: { type: String },
    number: { type: String }
  },
  password:  { type: String, required: true },
  
  role: { type: String, default: 'Retailer' },
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
  retailerId: { type: String, unique: true },
  licenseNumber: { type: String },
  storeType: { type: String }, // e.g., "Pharmacy", "Supermarket"
  hoursOfOperation: {
    open: { type: String },
    close: { type: String }
  },
  typesOfProductsSold: [{ type: String }], // e.g., ["Pharmaceuticals", "Medical Devices"]
  paymentMethodsAccepted: [{ type: String }], // e.g., ["Credit Card", "Cash"]
  alternateContactInformation: {
    fullName: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String }
  },
  uploadedDocuments: [{ type: String }], // URLs or paths to uploaded documents
  agreeToTermsAndConditions: { type: Boolean }
});

// module.exports = mongoose.model('Retailer', RetailerSchema);

const RetailUser = mongoose.model('RetailUser', retailUser);
module.exports = RetailUser;
