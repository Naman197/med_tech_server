const express = require('express');
const router = express.Router();
const upload = require('../../config/multer'); // Adjust the path as needed

const { 
    createOrder, 
    confirmOrder, 
    getOrdersByManufacturer, 
    updateOrderStatus, 
    getOrdersByDistributor, 
    updatePaymentStatus,
    updateBillingDetails,
    setOrderStatus,
    addFeedback, // Import the new controller function
} = require('../../controllers/manufacturers/ordercontroller');
const authenticateToken = require('../../middleware/authenticateToken'); // Ensure the correct path
const uploadMiddleware = upload.single('billingPdf');

// Route for updating billing details
router.patch('/:orderId/billing', authenticateToken, uploadMiddleware, updateBillingDetails);

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
router.patch('/:orderId/payment-status', authenticateToken, updatePaymentStatus);
// router.patch('/:orderId/billing', authenticateToken, updateBillingDetails);

router.patch('/:orderId/feedback', authenticateToken, addFeedback);


// Route for updating order status to 'Shipped' or 'Delivered'
router.patch('/:orderId/set-status', authenticateToken, setOrderStatus); // Updated route endpoint


module.exports = router;
