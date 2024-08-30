const Order = require('../models/orderModel');
const RetailOrder=require('../../models/retailer/orderSchema')
// Controller function to track a specific order by ID
exports.trackOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('distributor', 'name');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            pharmacyName: order.pharmacyName,
            category: order.category,
            batchNo: order.batchNo,
            expiryDate: order.expiryDate,
            mrp: order.mrp,
            buyingPrice: order.buyingPrice,
            orderStatus: order.orderStatus,
            distributorName: order.distributor.name,
            feedback: order.feedback,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
};

// Controller function to show all orders for a specific pharmacy or hospital by their ID
exports.showOrdersByPharmacy = async (req, res) => {
    try {
        const pharmacyId = req.params.pharmacyId;
        const orders = await Order.find({ pharmacyName: pharmacyId }).populate('distributor', 'name');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this pharmacy or hospital' });
        }

        res.status(200).json(orders.map(order => ({
            pharmacyName: order.pharmacyName,
            category: order.category,
            batchNo: order.batchNo,
            expiryDate: order.expiryDate,
            mrp: order.mrp,
            buyingPrice: order.buyingPrice,
            orderStatus: order.orderStatus,
            distributorName: order.distributor.name,
            feedback: order.feedback,
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};
