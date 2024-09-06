
const Order = require('../../models/manufacturers/orders');
const Distributor = require('../../models/distributors/distributorUser');
const Manufacturer = require('../../models/manufacturers/user');
const ManufacturerProduct = require('../../models/manufacturers/inventory');

const calculateTotals = async (req, res) => {
    try {
        // Get the manufacturerId from the authenticated user
        const manufacturerId  =  req.user.id
        // 1. Get total orders for the manufacturer
        const totalOrders = await Order.countDocuments({ manufacturerId });

        // 2. Get pending orders for the manufacturer
        const pendingOrders = await Order.countDocuments({
            manufacturerId,
            orderStatus: 'pending'
        });

        // 3. Get the count of medicines with qty = 0 for the manufacturer
        const zeroQtyMedicines = await ManufacturerProduct.countDocuments({
            manufacturerId,
            qty: 0
        });

        // Return the results
        return res.json({
            totalOrders,
            pendingOrders,
            zeroQtyMedicines
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};




module.exports = {
    calculateTotals
};