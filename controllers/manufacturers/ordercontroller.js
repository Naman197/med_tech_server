// controllers/orderController.js
const Order = require('../../models/manufacturers/orders');
const Distributor = require('../../models/distributors/distributorUser');
const Manufacturer = require('../../models/manufacturers/user');
const ManufacturerProduct = require('../../models/manufacturers/inventory');
const cloudinary = require('../../config/cloudinary'); 
const fs = require('fs'); 

// Create a new order
const createOrder = async (req, res) => {
    try {
        console.log("hi");
        const {
            manufacturerName,
            medicines,
            billingDetails = {}
        } = req.body;

        if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ message: 'Medicines array is required' });
        }

        for (const medicine of medicines) {
            if (!medicine.qty) {
                return res.status(400).json({ message: 'Medicine qty is required' });
            }
        }

        // Extract distributorId from authenticated user
        const distributorId = req.user.id;

        // Find the distributor and manufacturer details
        const distributor = await Distributor.findById(distributorId);
        if (!distributor) {
            return res.status(404).json({ message: 'Distributor not found' });
        }

        const manufacturer = await Manufacturer.findOne({ organizationName: manufacturerName });
        if (!manufacturer) {
            return res.status(404).json({ message: 'Manufacturer not found' });
        }

        // Process medicines and fetch details
        const populatedMedicines = [];
        for (const medicine of medicines) {
            const product = await ManufacturerProduct.findOne({ name: medicine.name });
            if (product) {
                populatedMedicines.push({
                    ...medicine,
                    manufacturerId: product._id,
                    batchNo: product.batchNo,
                    mrp: product.mrp,
                    cost: product.cost,
                    productionDate: product.productionDate,
                    expiryDate: product.expiryDate,
                    composition: product.composition,
                    temperature: product.temperature
                });
            } else {
                return res.status(404).json({ message: `Medicine '${medicine.name}' not found` });
            }
        }

        // Create new order
        const newOrder = new Order({
            distributor: {
                distributorId: distributor._id,
                name: distributor.fullName
            },
            manufacturer: {
                manufacturerId: manufacturer._id,
                name: manufacturer.name
            },
            medicines: populatedMedicines,
            billingDetails: billingDetails || {}
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};



// Update order details
// const updateOrder = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const updateData = req.body;

//         // Find and update the order
//         const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
//         if (!updatedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update order', error: error.message });
//     }
// };

// // Get all orders for a manufacturer
const getOrdersByManufacturer = async (req, res) => {
    try {
        const manufacturerId = req.user.id; // Extracted from token

        // Fetch orders for the given manufacturer ID
        const orders = await Order.find({
            'manufacturer.manufacturerId': manufacturerId
        }).populate('distributor.distributorId', 'fullName address')
          .populate('manufacturer.manufacturerId', 'name')
          .populate('medicines.manufacturerId', 'name batchNo mrp cost productionDate expiryDate composition temperature');

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for the given manufacturer.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
};
const confirmOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let allMedicinesAvailable = true;
      let failedMedicines = [];
  
      // Process each medicine in the order
      for (const medicine of order.medicines) {
        // Ensure qty is a number and valid
        let qty = Number(medicine.qty);
  
        // Log the type and value of qty for debugging
        console.log(`Type of qty for medicine ${medicine.name}: ${typeof qty}`);
        console.log(`Value of qty for medicine ${medicine.name}: ${qty}`);
  
        // Check if qty is NaN or non-positive
        if (isNaN(qty) || qty <= 0) {
          allMedicinesAvailable = false;
          failedMedicines.push({ name: medicine.name, reason: 'Invalid quantity' });
          continue;
        }
  
        // Find the product by ID
        const product = await ManufacturerProduct.findById(medicine.manufacturerId);
  
        if (!product) {
          allMedicinesAvailable = false;
          failedMedicines.push({ name: medicine.name, reason: 'Medicine not found' });
          continue;
        }
  
        // Ensure product.qty is a number and valid
        let productQty = Number(product.qty);
  
        console.log(`Type of product.qty for medicine ${medicine.name}: ${typeof productQty}`);
        console.log(`Value of product.qty for medicine ${medicine.name}: ${productQty}`);
  
        if (isNaN(productQty) || productQty < qty) {
          allMedicinesAvailable = false;
          failedMedicines.push({ name: medicine.name, reason: 'Insufficient quantity' });
          continue;
        }
  
        // Update product quantity
        product.qty -= qty;
        await product.save();
      }
  
      // Update order status based on availability
      if (allMedicinesAvailable) {
        order.orderStatus = 'Processing';
      } else {
        order.orderStatus = 'Failed';
        order.failedMedicines = failedMedicines; // Optionally record failed medicines
      }
  
      await order.save();
  
      res.status(200).json({
        message: allMedicinesAvailable ? 'Order confirmed successfully' : 'Order failed',
        order
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to confirm order', error: error.message });
    }
  };
  const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate the provided status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'Failed']; // Adjust these statuses as per your business logic
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find and update the order's status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};

// Get all orders for a distributor
const getOrdersByDistributor = async (req, res) => {
    try {
        // Extract distributorId from authenticated user
        const distributorId = req.user.id;

        // Fetch orders for the given distributor ID
        const orders = await Order.find({ 'distributor.distributorId': distributorId })
            .populate('manufacturer.manufacturerId', 'name')
            .populate('medicines.manufacturerId', 'name batchNo mrp cost productionDate expiryDate composition temperature');

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for the given distributor.' });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus, transactionId, paymentDate } = req.body;

        // Validate the provided payment status
        if (!['Pending', 'Completed'].includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        // Find and update the order with the new payment status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    'paymentStatus': paymentStatus,
                    'paymentDetails.transactionId': transactionId,
                    'paymentDetails.paymentDate': paymentDate
                }
            },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Payment status updated successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update payment status', error: error.message });
    }
};

const updateBillingDetails = async (req, res) => {
    const { orderId } = req.params;
    const { totalAmount, invoiceNumber } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Handle file upload to Cloudinary
        let billingPdfUrl = order.billingDetails.billingPdf;
        if (req.file) {
            // Upload file to Cloudinary with explicit public access
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'auto', // Automatically detect the type of file (e.g., image, pdf)
                access_mode: 'public' // Set the access mode to public
            });
            billingPdfUrl = result.secure_url; // Get the URL of the uploaded file

            // Optionally, remove the local file if you don't need it anymore
            fs.unlinkSync(req.file.path); // Uncomment if you want to delete the file after upload
        }

        // Update billing details
        order.billingDetails.totalAmount = totalAmount || order.billingDetails.totalAmount;
        order.billingDetails.invoiceNumber = invoiceNumber || order.billingDetails.invoiceNumber;
        order.billingDetails.billingPdf = billingPdfUrl; // Update with Cloudinary URL
        order.billingDetails.billingDate = new Date(); // Update to the current date

        // Update order status to 'Packing'
        order.orderStatus = 'Packing';

        await order.save();
        res.status(200).json({ message: 'Billing details and order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update billing details and order status', error: error.message });
    }
};

const setOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const validStatuses = ['Shipped', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status
        order.orderStatus = status;

        await order.save();
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};

module.exports = {
    createOrder,
    confirmOrder,
    getOrdersByManufacturer,
    updateOrderStatus,
    getOrdersByDistributor,
    updatePaymentStatus,
    updateBillingDetails,
    setOrderStatus// Export the new function
};