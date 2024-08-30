const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/retailer/orderController');

router.get('/trackOrder/:id', orderController.trackOrder);

router.get('/showOrders/:pharmacyId', orderController.showOrdersByPharmacy);

module.exports = router;
