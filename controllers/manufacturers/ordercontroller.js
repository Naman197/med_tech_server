// controllers/orderController.js
const Order = require('../../models/manufacturers/orders');
const Distributor = require('../../models/distributors/distributorUser');
const Manufacturer = require('../../models/manufacturers/user');
const ManufacturerProduct = require('../../models/manufacturers/inventory');
const DistProduct=require('../../models/distributors/inventory');
const cloudinary = require('../../config/cloudinary'); 
const fs = require('fs'); 
const QRCode  = require('../../models/manufacturers/qrCode');

// Create a new order
// const createOrder = async (req, res) => {
//     try {
//         console.log("hi");
//         const {
//             manufacturerName,
//             medicines,
//             billingDetails = {}
//         } = req.body;

//         if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//             return res.status(400).json({ message: 'Medicines array is required' });
//         }

//         for (const medicine of medicines) {
//             if (!medicine.qty) {
//                 return res.status(400).json({ message: 'Medicine qty is required' });
//             }
//         }

//         // Extract distributorId from authenticated user
//         const distributorId = req.user.id;

//         // Find the distributor and manufacturer details
//         const distributor = await Distributor.findById(distributorId);
//         if (!distributor) {
//             return res.status(404).json({ message: 'Distributor not found' });
//         }

//         const manufacturer = await Manufacturer.findOne({ organizationName: manufacturerName });
//         if (!manufacturer) {
//             return res.status(404).json({ message: 'Manufacturer not found' });
//         }

//         // Process medicines and fetch details
//         const populatedMedicines = [];
//         for (const medicine of medicines) {
//             const product = await ManufacturerProduct.findOne({ name: medicine.name });
//             if (product) {
//                 populatedMedicines.push({
//                     ...medicine,
//                     manufacturerId: product._id,
//                     batchNo: product.batchNo,
//                     mrp: product.mrp,
//                     cost: product.cost,
//                     productionDate: product.productionDate,
//                     expiryDate: product.expiryDate,
//                     composition: product.composition,
//                     temperature: product.temperature
//                 });
//             } else {
//                 return res.status(404).json({ message: `Medicine '${medicine.name}' not found` });
//             }
//         }

//         // Create new order
//         const newOrder = new Order({
//             distributor: {
//                 distributorId: distributor._id,
//                 name: distributor.fullName
//             },
//             manufacturer: {
//                 manufacturerId: manufacturer._id,
//                 name: manufacturer.name
//             },
//             medicines: populatedMedicines,
//             billingDetails: billingDetails || {}
//         });

//         await newOrder.save();

//         res.status(201).json({ message: 'Order created successfully', order: newOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create order', error: error.message });
//     }
// };


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
                name: manufacturer.organizationName
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

// const updatePaymentStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         // const { paymentStatus, transactionId, paymentDate } = req.body;

//         // // Validate the provided payment status
//         // if (!['Pending', 'Completed'].includes(paymentStatus)) {
//         //     return res.status(400).json({ message: 'Invalid payment status' });
//         // }

//         // Find and update the order with the new payment status
//         // const updatedOrder = await Order.findByIdAndUpdate(
//         //     orderId,
//         //     {
//         //         $set: {
//         //             'paymentStatus': paymentStatus,
//         //             'paymentDetails.transactionId': transactionId,
//         //             'paymentDetails.paymentDate': paymentDate
//         //         }
//         //     },
//         //     { new: true } // Return the updated order
//         // );

//         // if (!updatedOrder) {
//         //     return res.status(404).json({ message: 'Order not found' });
//         // }

//         res.status(200).json({ message: 'Payment status updated successfully', order: updatedOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update payment status', error: error.message });
//     }
// };


const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find and update the order with the payment status set to "Completed"
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    'paymentStatus': 'Completed'
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

// const updateBillingDetails = async (req, res) => {
//     const { orderId } = req.params;
//     const { totalAmount, invoiceNumber } = req.body;
    
//     console.log('Updating billing details for order:', orderId);

//     try {
//         const order = await Order.findById(orderId);
//         if (!order) {
//             console.log('Order not found:', orderId);
//             return res.status(404).json({ message: 'Order not found' });
//         }
        
//         let billingPdfUrl = order.billingDetails.billingPdf;
//         if (req.file) {
//             console.log('Attempting to upload file to Cloudinary');
//             try {
//                 const result = await cloudinary.uploader.upload(req.file.path, {
//                     resource_type: 'auto',
//                     access_mode: 'public',
//                     folder: 'billing_pdfs'
//                 });
//                 console.log('Cloudinary upload result:', JSON.stringify(result, null, 2));
                
//                 billingPdfUrl = result.url;
//                 console.log('File uploaded successfully. URL:', billingPdfUrl);

//                 // Remove local file
//                 fs.unlinkSync(req.file.path);
//                 console.log('Local file removed');

//             } catch (uploadError) {
//                 console.error('Cloudinary upload error:', uploadError);
//                 return res.status(500).json({ message: 'Failed to upload file', error: uploadError.message });
//             }
//         }
        
//         // Update billing details
//         order.billingDetails.totalAmount = totalAmount || order.billingDetails.totalAmount;
//         order.billingDetails.invoiceNumber = invoiceNumber || order.billingDetails.invoiceNumber;
//         order.billingDetails.billingPdf = billingPdfUrl;
//         order.billingDetails.billingDate = new Date();
        
//         order.orderStatus = 'Success';
        
//         await order.save();
//         console.log('Order updated successfully');
//         res.status(200).json({ 
//             message: 'Billing details and order status updated successfully', 
//             order,
//             billingPdfUrl
//         });
//     } catch (error) {
//         console.error('Error updating billing details:', error);
//         res.status(500).json({ message: 'Failed to update billing details and order status', error: error.toString() });
//     }
// };


// const updateBillingDetails = async (req, res) => {
//     const { orderId } = req.params;
//     const { totalAmount, invoiceNumber } = req.body;

//     console.log('Updating billing details for order:', orderId);

//     try {
//         // Find the order by ID
//         const order = await Order.findById(orderId).populate('manufacturerId distributorId');
//         if (!order) {
//             console.log('Order not found:', orderId);
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         let billingPdfUrl = order.billingDetails.billingPdf;
//         let boxImageUrl;

//         if (req.file) {
//             console.log('Attempting to upload file to Cloudinary');
//             try {
//                 const result = await cloudinary.uploader.upload(req.file.path, {
//                     resource_type: 'auto',
//                     access_mode: 'public',
//                     folder: 'billing_pdfs'
//                 });
//                 console.log('Cloudinary upload result:', JSON.stringify(result, null, 2));
                
//                 billingPdfUrl = result.url;
//                 console.log('File uploaded successfully. URL:', billingPdfUrl);

//                 // Remove local file
//                 fs.unlinkSync(req.file.path);
//                 console.log('Local file removed');

//             } catch (uploadError) {
//                 console.error('Cloudinary upload error:', uploadError);
//                 return res.status(500).json({ message: 'Failed to upload file', error: uploadError.message });
//             }
//         }

//         if (req.body.boxImageFile) {
//             try {
//                 const boxImageResult = await cloudinary.uploader.upload(req.body.boxImageFile.path, {
//                     resource_type: 'image',
//                     access_mode: 'public',
//                     folder: 'box_images'
//                 });
//                 boxImageUrl = boxImageResult.url;
//             } catch (uploadError) {
//                 console.error('Cloudinary upload error:', uploadError);
//                 return res.status(500).json({ message: 'Failed to upload box image', error: uploadError.message });
//             }
//         }

//         // Generate QR code value and URL
//         const qrCodeValue = `QR_${orderId}_${new Date().getTime()}`;
//         const qrCodeUrl = `https://example.com/qrcodes/${qrCodeValue}`; // Modify this URL generation as needed

//         // Create a new QR code document
//         const qrCode = new QRCode({
//             qrCode: qrCodeValue,
//             location: order.deliveryLocation,
//             number: `QR-${orderId}`,
//             condition: 'Pending',
//             orderId: order._id,
//             distributorId: order.distributorId._id,
//             manufacturerId: order.manufacturerId._id,
//             accessDate: null, // Set when QR code is scanned
//             boxImage: boxImageUrl || null, // If the box image was uploaded
//             qrCodeUrl: qrCodeUrl // URL of the generated QR code image
//         });

//         await qrCode.save();

//         // Update order with the QR code ID
//         order.qrCode = qrCode._id;

//         // Update billing details
//         order.billingDetails.totalAmount = totalAmount || order.billingDetails.totalAmount;
//         order.billingDetails.invoiceNumber = invoiceNumber || order.billingDetails.invoiceNumber;
//         order.billingDetails.billingPdf = billingPdfUrl;
//         order.billingDetails.billingDate = new Date();

//         order.orderStatus = 'Success';

//         await order.save();
//         console.log('Order updated successfully');
//         res.status(200).json({ 
//             message: 'Billing details and order status updated successfully', 
//             order,
//             billingPdfUrl,
//             qrCodeValue, // Return the QR code value for reference
//             qrCodeUrl   // Return the QR code URL
//         });
//     } catch (error) {
//         console.error('Error updating billing details:', error);
//         res.status(500).json({ message: 'Failed to update billing details and order status', error: error.toString() });
//     }
// };


const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const Order = require('../models/Order');
const QRCode = require('../models/QRCode'); // Assuming you have a QRCode model

const updateBillingDetails = async (req, res) => {
    const { orderId } = req.params;
    const { totalAmount, invoiceNumber } = req.body;

    console.log('Updating billing details for order:', orderId);

    try {
        // Find the order by ID and populate manufacturer and distributor references
        const order = await Order.findById(orderId)
            .populate('manufacturer.manufacturerId')
            .populate('distributor.distributorId');

        if (!order) {
            console.log('Order not found:', orderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        let billingPdfUrl = order.billingDetails.billingPdf;
        let boxImageUrl;

        if (req.file) {
            console.log('Attempting to upload file to Cloudinary');
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: 'auto',
                    access_mode: 'public',
                    folder: 'billing_pdfs'
                });
                console.log('Cloudinary upload result:', JSON.stringify(result, null, 2));
                
                billingPdfUrl = result.url;
                console.log('File uploaded successfully. URL:', billingPdfUrl);

                // Remove local file
                fs.unlinkSync(req.file.path);
                console.log('Local file removed');
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload file', error: uploadError.message });
            }
        }

        if (req.body.boxImageFile) {
            try {
                const boxImageResult = await cloudinary.uploader.upload(req.body.boxImageFile.path, {
                    resource_type: 'image',
                    access_mode: 'public',
                    folder: 'box_images'
                });
                boxImageUrl = boxImageResult.url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload box image', error: uploadError.message });
            }
        }

        // Generate QR code value and URL
        const qrCodeValue = `QR_${orderId}_${new Date().getTime()}`;
        const qrCodeUrl = `http://localhost:5173/qrcodes/${qrCodeValue}`; // Modify this URL generation as needed

        // Create a new QR code document
        const qrCode = new QRCode({
            qrCode: qrCodeValue,
            location: order.deliveryLocation,
            number: `QR-${orderId}`,
            condition: 'Pending',
            orderId: order._id,
            distributorId: order.distributor.distributorId._id,
            manufacturerId: order.manufacturer.manufacturerId._id,
            accessDate: null, // Set when QR code is scanned
            boxImage: boxImageUrl || null, // If the box image was uploaded
            qrCodeUrl: qrCodeUrl // URL of the generated QR code image
        });

        await qrCode.save();

        // Update order with the QR code ID
        order.qrCode = qrCode._id;

        // Update billing details
        order.billingDetails.totalAmount = totalAmount || order.billingDetails.totalAmount;
        order.billingDetails.invoiceNumber = invoiceNumber || order.billingDetails.invoiceNumber;
        order.billingDetails.billingPdf = billingPdfUrl;
        order.billingDetails.billingDate = new Date();

        order.orderStatus = 'Success';

        await order.save();
        console.log('Order updated successfully');
        res.status(200).json({ 
            message: 'Billing details and order status updated successfully', 
            order,
            billingPdfUrl,
            qrCodeValue, // Return the QR code value for reference
            qrCodeUrl   // Return the QR code URL
        });
    } catch (error) {
        console.error('Error updating billing details:', error);
        res.status(500).json({ message: 'Failed to update billing details and order status', error: error.toString() });
    }
};

module.exports = updateBillingDetails;







// const setOrderStatus = async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     try {
//         const validStatuses = ['Shipped', 'Delivered'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: 'Invalid status' });
//         }

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
     
//         // Update order status
//         order.orderStatus = status;

//         await order.save();
//         res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update order status', error: error.message });
//     }
// };




// const setOrderStatus = async (req, res) => {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     try {
//         const validStatuses = ['Shipped', 'Delivered'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ message: 'Invalid status' });
//         }

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Update order status
//         order.orderStatus = status;

//         if (status === 'Delivered') {
//             // Find the distributor associated with the order
//             const distributorId = order.distributor.distributorId;

//             // Update inventory for the specific distributor when the order is delivered
//             for (const medicine of order.medicines) {
//                 await DistProduct.findOneAndUpdate(
//                     { distributor: distributorId, name: medicine.name, batchNo: medicine.batchNo },
//                     { $inc: { qty: medicine.qty } },
//                     { upsert: true } // If the document doesn't exist, create it
//                 );
//             }
//         }

//         await order.save();
//         res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to update order status', error: error.message });
//     }
// };


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

        if (status === 'Delivered') {
            // Find the distributor associated with the order
            const distributorId = order.distributor.distributorId;

            // Update inventory for the specific distributor when the order is delivered
            for (const medicine of order.medicines) {
                await DistProduct.findOneAndUpdate(
                    {
                        distributor: distributorId,
                        name: medicine.name,
                        batchNo: medicine.batchNo
                    },
                    {
                        $inc: { qty: medicine.qty },
                        $set: {
                            category: medicine.category,
                            expiryDate: medicine.expiryDate,
                            mrp: medicine.mrp,
                            cost: medicine.sellingPrice,
                            deliveredDateTemperature: medicine.temperature,
                            // rack: medicine.rack,
                            composition: Array.isArray(medicine.composition) ? medicine.composition.join(', ') : medicine.composition
                        }
                    },
                    { upsert: true, new: true } // If the document doesn't exist, create it; return the updated document
                );
            }
        }

        await order.save();
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error: error.message });
    }
};


const addFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { comment, rating } = req.body;

        // Define valid ratings
        const validRatings = [
            'Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'
        ];

        // Validate rating
        if (!validRatings.includes(rating)) {
            return res.status(400).json({ message: 'Invalid rating provided' });
        }

        // Validate comment content (optional)
        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Feedback comment cannot be empty' });
        }

        // Find and update the order with the new feedback
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    'feedback.comment': comment,
                    'feedback.rating': rating,
                    'feedback.feedbackDate': new Date() // Set feedbackDate to current date
                }
            },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Feedback added successfully', order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add feedback', error: error.message });
    }
};
// const createReturnOrder = async (req, res) => {
//     try {
//         const {
//             manufacturerName,
//             medicines,
//             billingDetails = {},
//             returnReason,
//             returnDate
//         } = req.body;

//         if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//             return res.status(400).json({ message: 'Medicines array is required' });
//         }

//         for (const medicine of medicines) {
//             if (!medicine.qty) {
//                 return res.status(400).json({ message: 'Medicine qty is required' });
//             }
//         }

//         // Extract distributorId from authenticated user
//         const distributorId = req.user.id;

//         // Find the distributor and manufacturer details
//         const distributor = await Distributor.findById(distributorId);
//         if (!distributor) {
//             return res.status(404).json({ message: 'Distributor not found' });
//         }

//         const manufacturer = await Manufacturer.findOne({ organizationName: manufacturerName });
//         if (!manufacturer) {
//             return res.status(404).json({ message: 'Manufacturer not found' });
//         }

//         // Process medicines and fetch details
//         const populatedMedicines = [];
//         for (const medicine of medicines) {
//             const product = await ManufacturerProduct.findOne({ name: medicine.name });
//             if (product) {
//                 populatedMedicines.push({
//                     ...medicine,
//                     manufacturerId: product._id,
//                     batchNo: product.batchNo,
//                     mrp: product.mrp,
//                     cost: product.cost,
//                     productionDate: product.productionDate,
//                     expiryDate: product.expiryDate,
//                     composition: product.composition,
//                     temperature: product.temperature
//                 });
//             } else {
//                 return res.status(404).json({ message: `Medicine '${medicine.name}' not found` });
//             }
//         }

//         // Create new return order
//         const newOrder = new Order({
//             distributor: {
//                 distributorId: distributor._id,
//                 name: distributor.fullName
//             },
//             manufacturer: {
//                 manufacturerId: manufacturer._id,
//                 name: manufacturer.name
//             },
//             medicines: populatedMedicines,
//             billingDetails: billingDetails || {},
//             orderType: 'Returned', // Set the order type to 'Returned'
//             returnDetails: {
//                 reason: returnReason,
//                 returnDate: returnDate || new Date()
//             }
//         });

//         await newOrder.save();

//         res.status(201).json({ message: 'Return order created successfully', order: newOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create return order', error: error.message });
//     }
// };



// const createReturnOrder = async (req, res) => {
//     try {
//         const {
//             manufacturerName,
//             medicines,
//             billingDetails = {},
//             returnReason,
//             returnDate
//         } = req.body;

//         if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
//             return res.status(400).json({ message: 'Medicines array is required' });
//         }

//         for (const medicine of medicines) {
//             if (!medicine.qty) {
//                 return res.status(400).json({ message: 'Medicine qty is required' });
//             }
//         }

//         // Extract distributorId from authenticated user
//         const distributorId = req.user.id;

//         // Find the distributor and manufacturer details
//         const distributor = await Distributor.findById(distributorId);
//         if (!distributor) {
//             return res.status(404).json({ message: 'Distributor not found' });
//         }

//         const manufacturer = await Manufacturer.findOne({ organizationName: manufacturerName });
//         if (!manufacturer) {
//             return res.status(404).json({ message: 'Manufacturer not found' });
//         }

//         // Process medicines and fetch details
//         const populatedMedicines = [];
//         for (const medicine of medicines) {
//             const product = await ManufacturerProduct.findOne({ name: medicine.name });
//             if (product) {
//                 populatedMedicines.push({
//                     ...medicine,
//                     manufacturerId: product._id,
//                     batchNo: product.batchNo,
//                     mrp: product.mrp,
//                     cost: product.cost,
//                     productionDate: product.productionDate,
//                     expiryDate: product.expiryDate,
//                     composition: product.composition,
//                     temperature: product.temperature
//                 });
//             } else {
//                 return res.status(404).json({ message: `Medicine '${medicine.name}' not found` });
//             }
//         }

//         // Create new return order
//         const newOrder = new Order({
//             distributor: {
//                 distributorId: distributor._id,
//                 name: distributor.fullName
//             },
//             manufacturer: {
//                 manufacturerId: manufacturer._id,
//                 name: manufacturer.name
//             },
//             medicines: populatedMedicines,
//             billingDetails: billingDetails || {},
//             orderType: 'Returned', // Set the order type to 'Returned'
//             returnDetails: {
//                 reason: returnReason,
//                 returnDate: returnDate || new Date()
//             }
//         });

//         await newOrder.save();

//         res.status(201).json({ message: 'Return order created successfully', order: newOrder });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create return order', error: error.message });
//     }
// };
const createReturnOrder = async (req, res) => {
    try {
        const {
            manufacturerId,
            medicines,
            billingDetails = {},
            returnReason,
            returnDate
        } = req.body;

        if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ message: 'Medicines array is required' });
        }

        for (const medicine of medicines) {
            if (!medicine.qty) {
                return res.status(400).json({ message: 'Medicine qty is required' });
            }
        }

        const distributorId = req.user.id;

        const distributor = await Distributor.findById(distributorId);
        if (!distributor) {
            return res.status(404).json({ message: 'Distributor not found' });
        }

        const manufacturer = await Manufacturer.findById(manufacturerId);
        if (!manufacturer) {
            return res.status(404).json({ message: 'Manufacturer not found' });
        }

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

        // Create new return order
        const newOrder = new Order({
            distributor: {
                distributorId: distributor._id,
                name: distributor.fullName
            },
            manufacturer: {
                manufacturerId: manufacturer._id,
                name: manufacturer.organizationName // Fetching the name from the manufacturer object
            },
            medicines: populatedMedicines,
            billingDetails: {
                totalAmount: billingDetails.totalAmount,
                invoiceNumber: billingDetails.invoiceNumber,
                billingPdf: billingDetails.billingPdf,
                billingDate: billingDetails.billingDate || new Date()
            },
            orderType: 'Returned', // Set the order type to 'Returned'
            returnDetails: {
                reason: returnReason,
                returnDate: returnDate || new Date()
            }
        });

        await newOrder.save();

        // Update inventory for the distributor to reflect the returned products
        for (const medicine of populatedMedicines) {
            await DistProduct.findOneAndUpdate(
                { distributor: distributorId, name: medicine.name, batchNo: medicine.batchNo },
                { $inc: { qty: -medicine.qty } } // Subtract the returned quantity from inventory
            );
        }

        res.status(201).json({ message: 'Return order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create return order', error: error.message });
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
    setOrderStatus,
    addFeedback,
    createReturnOrder// Export the new function
};