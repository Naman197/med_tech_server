const DistProduct = require('../../models/distributors/inventory');

// Fetch all inventory items for the authenticated distributor
const getAllInventory = async (req, res) => {
    try {
        const distributorId = req.user.id;

        const inventory = await DistProduct.find({ distributor: distributorId });
        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: 'No inventory found for this distributor' });
        }

        res.status(200).json({ inventory });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
    }
};

// Fetch a specific inventory item by product name
const getInventoryByName = async (req, res) => {
    try {
        const distributorId = req.user.id;
        const { productName } = req.params;

        const inventoryItem = await DistProduct.findOne({
            distributor: distributorId,
            name: productName
        });

        if (!inventoryItem) {
            return res.status(404).json({ message: 'Product not found in inventory' });
        }

        res.status(200).json({ inventoryItem });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inventory item', error: error.message });
    }
};

// Fetch inventory items by category
const getInventoryByCategory = async (req, res) => {
    try {
        const distributorId = req.user.id;
        const { category } = req.params;

        const inventoryByCategory = await DistProduct.find({
            distributor: distributorId,
            category
        });

        if (!inventoryByCategory || inventoryByCategory.length === 0) {
            return res.status(404).json({ message: 'No inventory found for this category' });
        }

        res.status(200).json({ inventory: inventoryByCategory });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inventory by category', error: error.message });
    }
};

module.exports = {
    getAllInventory,
    getInventoryByName,
    getInventoryByCategory
};
