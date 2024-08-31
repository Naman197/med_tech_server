const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/retailer/OrderController'); // Adjust the path as necessary
const authenticateToken = require('../../middleware/authenticateToken');

// Endpoint to create a new order
// router.post('/orders', OrderController.createOrder);

// // Endpoint to get all orders
// router.get('/orders', OrderController.getAllOrders);

// // Endpoint to get a specific order by ID
// router.get('/orders/:orderId', OrderController.getOrderById);

// // Endpoint to update a specific order by ID
// router.put('/orders/:orderId', OrderController.updateOrder);

// // Endpoint to process order refund
// router.put('/orders/:orderId/refund', OrderController.processRefund);

// // Endpoint to process order payment
// router.put('/orders/:orderId/payment', OrderController.processPayment);

// // Endpoint to delete a specific order by ID
// router.delete('/orders/:orderId', OrderController.deleteOrder);

// Endpoint to get orders by pharmacy name
router.get('/pharmacy',authenticateToken, OrderController.showOrdersByPharmacy);

module.exports = router;
