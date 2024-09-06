const Order = require('../../models/manufacturers/orders');
const Medicine = require('../../models/manufacturers/inventory'); // Assuming Medicine is the inventory model

// Calculate totals for orders and medicines
const calculateTotals = async (req, res) => {
    try {
        // Get the manufacturerId from the authenticated user
        console.log(req.user);
        const  manufacturerId  = req.user.id;

        // Debug: Log the manufacturer ID
        console.log('Manufacturer ID:', manufacturerId);

        // 1. Get total orders for the manufacturer
        const totalOrders = await Order.countDocuments({ 'manufacturer.manufacturerId': manufacturerId });
        console.log('Total Orders:', totalOrders);

        // 2. Get pending orders for the manufacturer
        const pendingOrders = await Order.countDocuments({
            'manufacturer.manufacturerId': manufacturerId,
            orderStatus: 'Pending' // Ensure this matches the exact enum case
        });
        console.log('Pending Orders:', pendingOrders);

        // 3. Get the count of medicines with qty = 0 for the manufacturer
        const zeroQtyMedicines = await Order.countDocuments({
            'manufacturer.manufacturerId': manufacturerId,
            'medicines.qty': 0 // Ensure this matches the structure of the medicines array
        });
        console.log('Zero Qty Medicines:', zeroQtyMedicines);

        // Return the results
        return res.json({
            totalOrders,
            pendingOrders,
            zeroQtyMedicines
        });
    } catch (error) {
        console.error('Error calculating totals:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    calculateTotals
};
