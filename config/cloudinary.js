const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
    cloud_name:"dbregd9o7",
    api_key: "652113516216415",
    api_secret: "SLqSl9GXdjw-VEHL9wG73RvXFTA"
  });

module.exports = cloudinary;
