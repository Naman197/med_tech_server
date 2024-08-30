
const express = require('express');
const router = express.Router();
const retailInventoryController = require('../../controllers/retailer/retailInventoryController');

// Define routes and link them to controller functions
router.get('/items', retailInventoryController.getAllInventory);
// router.post('/items', retailInventoryController.createInventory);
// router.get('/items/:id', retailInventoryController.getInventoryById);
// router.put('/items/:id', retailInventoryController.updateInventory);
// router.delete('/items/:id', retailInventoryController.deleteInventory);
// router.get('/items/:id/demand', retailInventoryController.analyzeDemand);


module.exports = router;
