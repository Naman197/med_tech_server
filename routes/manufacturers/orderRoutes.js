const express = require('express');
const router = express.Router();
const { createOrder ,confirmOrder,getOrdersByManufacturer,updateOrderStatus,getOrdersByDistributor} = require('../../controllers/manufacturers/ordercontroller');
const authenticateToken = require('../../middleware/authenticateToken'); // Ensure the correct path

// Create a new order
router.post('/', authenticateToken, createOrder);
router.post('/confirm/:orderId', confirmOrder);

// Update order details
// Uncomment and adjust as needed
// router.put('/:orderId', authenticateToken, updateOrder);

// Get all orders by manufacturer ID
// Uncomment and adjust as needed
 router.get('/ordersOfdist', authenticateToken, getOrdersByManufacturer);
 router.get('/distributor/orderdetails',authenticateToken,getOrdersByDistributor);

// Update order status
router.patch('/orders/:orderId/status', authenticateToken, updateOrderStatus);

module.exports = router;
