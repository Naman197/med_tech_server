const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    confirmOrder, 
    getOrdersByManufacturer, 
    updateOrderStatus, 
    getOrdersByDistributor, 
    updatePaymentStatus,
    updateBillingDetails // Import the new controller function
} = require('../../controllers/manufacturers/ordercontroller');
const authenticateToken = require('../../middleware/authenticateToken'); // Ensure the correct path

// Create a new order
router.post('/', authenticateToken, createOrder);

// Confirm an order
router.post('/confirm/:orderId', authenticateToken, confirmOrder);

// Get all orders by manufacturer ID
router.get('/ordersOfdist', authenticateToken, getOrdersByManufacturer);

// Get orders by distributor ID
router.get('/distributor/orderdetails', authenticateToken, getOrdersByDistributor);

// Update order status
router.patch('/orders/:orderId/status', authenticateToken, updateOrderStatus);

// Update payment status
router.patch('/orders/:orderId/payment-status', authenticateToken, updatePaymentStatus);
router.patch('/orders/:orderId/billing', authenticateToken, updateBillingDetails);


module.exports = router;
