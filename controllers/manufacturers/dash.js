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

// const calculateTotals = async (req, res) => {
//     try {
//         const manufacturerId = req.user.id;

//         // Debugging: Print manufacturer ID
//         console.log('Manufacturer ID:', manufacturerId);

//         const totalOrders = await Order.countDocuments({ 'manufacturer.manufacturerId': manufacturerId });
//         console.log('Total Orders:', totalOrders);

//         const pendingOrders = await Order.countDocuments({
//             'manufacturer.manufacturerId': manufacturerId,
//             orderStatus: 'Pending'
//         });
//         console.log('Pending Orders:', pendingOrders);

//         // const zeroQtyMedicines = await Order.countDocuments({
//         //     'manufacturer.manufacturerId': manufacturerId,
//         //     'medicines.qty': 0
//         // });
//         const zeroQtyMedicines = await Order.countDocuments({
//             'manufacturer.manufacturerId': manufacturerId,
//             medicines: { $elemMatch: { qty: 0 } }
//         });
//         console.log('Zero Qty Medicines:', zeroQtyMedicines);

//         const monthlyData = [];
//         const currentDate = new Date();

//         for (let i = 0; i < 6; i++) {
//             const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//             const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

//             const ordersPlaced = await Order.countDocuments({
//                 'manufacturer.manufacturerId': manufacturerId,
//                 createdAt: { $gte: startOfMonth, $lte: endOfMonth },
//                 orderType: { $ne: 'Returned' }
//             });

//             const ordersReturned = await Order.countDocuments({
//                 'manufacturer.manufacturerId': manufacturerId,
//                 orderType: 'Returned',
//                 'returnDetails.returnDate': { $gte: startOfMonth, $lte: endOfMonth } // Ensure returnDate is considered
//             });

//             const fulfillmentRate = ordersPlaced > 0
//                 ? ((ordersPlaced - ordersReturned) / ordersPlaced) * 100
//                 : 0;

//             monthlyData.push({
//                 month: startOfMonth.toLocaleString('default', { month: 'long' }),
//                 year: startOfMonth.getFullYear(),
//                 ordersPlaced,
//                 ordersReturned,
//                 fulfillmentRate: fulfillmentRate.toFixed(2)
//             });
//         }

//         return res.json({
//             totalOrders,
//             pendingOrders,
//             zeroQtyMedicines,
//             monthlyData
//         });
//     } catch (error) {
//         console.error('Error calculating totals:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


module.exports = {
    calculateTotals
};
