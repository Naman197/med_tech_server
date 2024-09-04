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


const updateMargin = async (req, res) => {
    try {
        const { id } = req.params;
        const { margin } = req.body;

        // Find the product by ID
        const product = await DistProduct.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
  console.log(product.cost);
        // Calculate the selling price based on the cost price and margin
        const sellingPrice = product.cost + (product.cost * (margin / 100));

        // Update the product with the new margin and selling price
        product.margin = margin;
        product.sellingPrice = sellingPrice;

        // Save the updated product
        const updatedProduct = await product.save();

        res.status(200).json({ message: 'Margin and selling price updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update margin and selling price', error: error.message });
    }
};

const updateRack = async (req, res) => {
    try {
        const { id } = req.params;
        const { rack } = req.body;

        const updatedProduct = await DistProduct.findByIdAndUpdate(id, { rack }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Rack updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update rack', error: error.message });
    }
};

module.exports = {
    getAllInventory,
    getInventoryByName,
    getInventoryByCategory,
    updateMargin,
    updateRack
};
