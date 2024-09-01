const ManufacturerProduct = require('../../models/manufacturers/inventory');
const cloudinary = require('../../config/cloudinary');

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
        qty,
        productionDate,
        qualityCheck,
        machineNo,
        demand,
        barcode,
        composition,
        temperature,
        rack
      } = req.body;
  
      const manufacturerId = req.user.id; // Use user ID from the middleware
  
      let qualityCheckFiles = [];
  
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          if (file.mimetype.startsWith('image/')) {
            const result = await cloudinary.uploader.upload(file.path);
            qualityCheckFiles.push({ type: 'image', url: result.secure_url });
          } else if (file.mimetype === 'application/pdf') {
            const result = await cloudinary.uploader.upload(file.path, { resource_type: 'raw' });
            qualityCheckFiles.push({ type: 'pdf', url: result.secure_url });
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
        qty,
        productionDate,
        qualityCheck,
        qualityCheckImages:qualityCheckFiles, // Uncomment if using file uploads
        machineNo,
        demand,
        barcode,
        composition,
        temperature,
        rack,
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

    let qualityCheckFiles = product.qualityCheckFiles; // Retain existing files

    // Check if new files were uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.mimetype.startsWith('image/')) {
          const result = await cloudinary.uploader.upload(file.path);
          qualityCheckFiles.push({ type: 'image', url: result.secure_url });
        } else if (file.mimetype === 'application/pdf') {
          const result = await cloudinary.uploader.upload(file.path, { resource_type: 'raw' });
          qualityCheckFiles.push({ type: 'pdf', url: result.secure_url });
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