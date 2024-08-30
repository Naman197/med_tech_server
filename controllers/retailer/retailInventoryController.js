// Get all inventory items for the authenticated retailer
const dummyData = require('../../data/retailerinventory'); // Adjust path as necessary

// exports.getAllInventory = async (req, res) => {
//     try {
//       const retailerId =  req.user.id;; // Get retailer ID from request object
  
//     //   // Query inventory items by retailer ID
//     //   const inventoryItems = await Inventory.find({ retailer: retailerId });
  
//     //   res.status(200).json(inventoryItems);
//     res.status(200).json(dummyData);

//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
  


exports.getAllInventory = async (req, res) => {
    try {
      const retailerId = req.user.id; // Get retailer ID from request object
    console.log(retailerId);
      // Filter inventory items by retailer ID
      const inventoryItems = dummyData.filter(item => item.retailer === retailerId);
  
      if (inventoryItems.length > 0) {
        res.status(200).json(inventoryItems); // Send inventory items for the matched retailer
      } else {
        res.status(404).json({ message: 'No inventory items found for this retailer' }); // Handle case where no items are found
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };