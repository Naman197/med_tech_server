const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/manufacturers/inventoryController');
const upload = require('../../config/multer');
const authenticateToken = require('../../middleware/authenticateToken');

// Route to add new inventory data with authentication
router.post('/add-inventory', authenticateToken, upload.array('qualityCheckImages', 10), inventoryController.addInventory);

// Route to get all inventory data
router.get('/inventory', inventoryController.getInventory);
router.get('/productsbymanf', authenticateToken, inventoryController.getProductsByManufacturer);
router.put('/update-inventory/:id', 
  authenticateToken, // Middleware to authenticate user
  upload.array('qualityCheckImages', 10), // Multer middleware for file uploads
  inventoryController.updateInventory // Controller function to handle the update
);
router.get('/search-products', inventoryController.searchProducts);

module.exports = router;
