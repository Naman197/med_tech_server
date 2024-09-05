

const authenticateToken = require('../../middleware/authenticateToken');


router.post('/', authenticateToken, createOrder);

// Confirm an order
router.post('/confirm/:orderId', authenticateToken, confirmOrder);

// Get all orders by manufacturer ID
router.get('/ordersOfdist', authenticateToken, getOrdersByManufacturer);

// Get orders by distributor ID
router.get('/distributor/orderdetails', authenticateToken, getOrdersByDistributor);