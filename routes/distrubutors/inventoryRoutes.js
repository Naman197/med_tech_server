const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken');
const distProductController = require('../../controllers/distributors/inventoryController');

// Route to fetch all inventory items for the authenticated distributor
router.get('/inventory', authenticateToken, distProductController.getAllInventory);

// Route to fetch a specific inventory item by product name
router.get('/inventory/:productName', authenticateToken, distProductController.getInventoryByName);

router.put('/inventory/:id/margin', authenticateToken, distProductController.updateMargin);

// Route to update the rack of a specific inventory item by product ID
router.put('/inventory/:id/rack', authenticateToken, distProductController.updateRack);


module.exports = router;
