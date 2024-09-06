const ManufacturerProduct = require('../../models/manufacturers/inventory');
const cloudinary = require('../../config/cloudinary');
const fs=require('fs');
// Controller to add new inventory data
exports.addInventory = async (req, res) => {
  try {
    const {
      name,
      category,
      batchNo,
      expiryDate,
      mrp,
      cost,
      sellingPrice, // Added sellingPrice field
      qty,
      productionDate,
      qualityCheck,
      machineNo,
      demand,
      barcode,
      composition,
      temperature,
      rack,
      taxRate, // Added taxRate field

    } = req.body;

    const manufacturerId = req.user.id; // Use user ID from the middleware

    let qualityCheckFiles = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        console.log('File path:', file.path); // Log the file path
        try {
          let result;
          if (file.mimetype.startsWith('image/')) {
            result = await cloudinary.uploader.upload(file.path);
            console.log(result);
            qualityCheckFiles.push({ type: 'image', url: result.url }); // Use result.url for non-secure URL
          } else if (file.mimetype === 'application/pdf') {
            result = await cloudinary.uploader.upload(file.path, { resource_type: 'raw' });
            qualityCheckFiles.push({ type: 'pdf', url: result.url }); // Use result.url for non-secure URL
          }
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError.message);
          return res.status(500).json({ message: 'Failed to upload file to Cloudinary', error: cloudinaryError.message });
        }
      }
    }

    const newProduct = new ManufacturerProduct({
      name,
      category,
      batchNo,
      expiryDate,
      mrp,
      cost,
      sellingPrice, // Include sellingPrice field here
      qty,
      productionDate,
      qualityCheck,
      qualityCheckImages: qualityCheckFiles, // Include file uploads
      machineNo,
      demand,
      barcode,
      composition,
      temperature,
      rack,
      taxRate, // Save taxRate in the new product

      manufacturer: manufacturerId // Set the manufacturer ID
    });

    await newProduct.save();
    res.status(201).json({ message: 'Inventory item added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add inventory item', error: error.message });
  }
};

// Controller to get all inventory data
exports.getInventory = async (req, res) => {
  try {
    const inventory = await ManufacturerProduct.find().populate('manufacturer');
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve inventory data', error: error.message });
  }
};

// Controller to update existing inventory data
// exports.updateInventory = async (req, res) => {
//     try {
//       const {
//         name,
//         category,
//         batchNo,
//         expiryDate,
//         mrp,
//         cost,
//         qty,
//         productionDate,
//         qualityCheck,
//         machineNo,
//         demand,
//         barcode,
//         composition,
//         temperature,
//         rack,
//       } = req.body;
  
//       const manufacturerId = req.user.id; // Extract manufacturer ID from authenticated user
  
//       const product = await ManufacturerProduct.findById(req.params.id);
//       if (!product) {
//         return res.status(404).json({ message: 'Inventory item not found' });
//       }
  
//       let qualityCheckFiles = product.qualityCheckFiles; // Retain existing files
  
//       // Check if new files were uploaded
//       if (req.files && req.files.length > 0) {
//         console.log(req.files);
//         for (const file of req.files) {
//           try {
//             let result;
//             if (file.mimetype.startsWith('image/')) {
//               result = await cloudinary.uploader.upload(file.path);
//               qualityCheckFiles.push({ type: 'image', url: result.secure_url });
//             } else if (file.mimetype === 'application/pdf') {
//               result = await cloudinary.uploader.upload(file.path, { resource_type: 'raw' });
//               qualityCheckFiles.push({ type: 'pdf', url: result.secure_url });
//             }
  
//             // Remove the file from local storage after successful upload
//             fs.unlinkSync(file.path);
//           } catch (cloudinaryError) {
//             console.error('Cloudinary upload error:', cloudinaryError.message);
//             return res.status(500).json({ message: 'Failed to upload file to Cloudinary', error: cloudinaryError.message });
//           }
//         }
//       }
  
//       // Update the product with the new data
//       product.name = name || product.name;
//       product.category = category || product.category;
//       product.batchNo = batchNo || product.batchNo;
//       product.expiryDate = expiryDate || product.expiryDate;
//       product.mrp = mrp || product.mrp;
//       product.cost = cost || product.cost;
//       product.qty = qty || product.qty;
//       product.productionDate = productionDate || product.productionDate;
//       product.qualityCheck = qualityCheck !== undefined ? qualityCheck : product.qualityCheck;
//       product.qualityCheckFiles = qualityCheckFiles; // Update file references
//       product.machineNo = machineNo || product.machineNo;
//       product.demand = demand || product.demand;
//       product.barcode = barcode || product.barcode;
//       product.composition = composition || product.composition;
//       product.temperature = temperature || product.temperature;
//       product.rack = rack || product.rack;
//       product.manufacturer = manufacturerId; // Ensure manufacturer ID is correct
  
//       await product.save();
//       res.status(200).json({ message: 'Inventory item updated successfully', product });
//     } catch (error) {
//       res.status(500).json({ message: 'Failed to update inventory item', error: error.message });
//     }
//   };


exports.updateInventory = async (req, res) => {
    try {
      const {
        name,
        category,
        batchNo,
        expiryDate,
        mrp,
        cost,
        qty,
        productionDate,
        qualityCheck,
        machineNo,
        demand,
        barcode,
        composition,
        temperature,
        rack,
        manufacturer
      } = req.body;
  
      const product = await ManufacturerProduct.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
  
      // Initialize the qualityCheckFiles array
      let qualityCheckFiles = product.qualityCheckFiles || [];
  
      // Check if new files were uploaded
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            let result;
            if (file.mimetype.startsWith('image/')) {
              result = await cloudinary.uploader.upload(file.path);
              qualityCheckFiles.push({ type: 'image', url: result.secure_url });
            } else if (file.mimetype === 'application/pdf') {
              result = await cloudinary.uploader.upload(file.path, { resource_type: 'raw' });
              qualityCheckFiles.push({ type: 'pdf', url: result.secure_url });
            }
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError.message);
            return res.status(500).json({ message: 'Failed to upload file to Cloudinary', error: uploadError.message });
          }
        }
      }
  
      // Update the product with the new data
      product.name = name || product.name;
      product.category = category || product.category;
      product.batchNo = batchNo || product.batchNo;
      product.expiryDate = expiryDate || product.expiryDate;
      product.mrp = mrp || product.mrp;
      product.cost = cost || product.cost;
      product.qty = qty || product.qty;
      product.productionDate = productionDate || product.productionDate;
      product.qualityCheck = qualityCheck !== undefined ? qualityCheck : product.qualityCheck;
      product.qualityCheckFiles = qualityCheckFiles; // Update file references
      product.machineNo = machineNo || product.machineNo;
      product.demand = demand || product.demand;
      product.barcode = barcode || product.barcode;
      product.composition = composition || product.composition;
      product.temperature = temperature || product.temperature;
      product.rack = rack || product.rack;
      product.manufacturer = manufacturer || product.manufacturer;
  
      await product.save();
      res.status(200).json({ message: 'Inventory item updated successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update inventory item', error: error.message });
    }
  };
  


// Controller to get a single inventory item by ID
exports.getInventoryById = async (req, res) => {
    try {
      const { id } = req.params; // Get the ID from the route parameters
  
      // Find the inventory item by ID and populate the manufacturer details
      const inventoryItem = await ManufacturerProduct.findById(id).populate('manufacturer');
  
      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
  
      res.status(200).json(inventoryItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve inventory item', error: error.message });
    }
  };
  exports.getProductsByManufacturer = async (req, res) => {
    try {
      const manufacturerId = req.user.id; // Extract manufacturerId from authenticated user
  
      const products = await ManufacturerProduct.find({ manufacturer: manufacturerId });
  
      if (!products.length) {
        return res.status(404).json({ message: 'No products found for this manufacturer.' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
    }
  };


  exports.searchProducts = async (req, res) => {
    try {
          console.log(req.query);

      const { batchNo, name, barcode } = req.query;
      // Build query object based on provided parameters
      let query = {};
      if (batchNo) {
        query.batchNo = batchNo;
      }
      if (name) {
        query.name = name;
      }
      // Handle barcode parameter: if it is an empty string or undefined, it will be omitted from the query
      if (barcode !== undefined && barcode !== '') {
        query.barcode = barcode;
      }
  
      // Fetch products from the database based on query
      const products = await ManufacturerProduct.find(query);
  
      if (!products.length) {
        return res.status(404).json({ message: 'No products found with the given criteria.' });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
    }
  };
  