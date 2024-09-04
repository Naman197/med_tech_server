// controllers/qrCodeController.js

const { response } = require('express');
const QRCode = require('../../models/manufacturers/qrCode'); // Import QRCode model

// Get QR code by QR code ID
const getQRCodeById = async (req, res) => {
    const { id } = req.params;
     console.log("hello",id);
    try {
        const qrCode = await QRCode.findById(id).populate('orderId distributorId manufacturerId');
        if (!qrCode) {
            return res.status(404).json({ message: 'QR Code not found' });
        }
        res.status(200).json({ qrCode });
    } catch (error) {
        console.error('Error fetching QR code by ID:', error);
        res.status(500).json({ message: 'Failed to fetch QR code', error: error.toString() });
    }
};

// Get QR code by order ID and distributor ID
const getQRCodeByOrderAndDistributor = async (req, res) => {
    const { orderId, distributorId } = req.query;

    try {
        const qrCode = await QRCode.findOne({ orderId, distributorId }).populate('orderId distributorId manufacturerId');
        if (!qrCode) {
            return res.status(404).json({ message: 'QR Code not found' });
        }
        res.status(200).json({ qrCode });
    } catch (error) {
        console.error('Error fetching QR code by order ID and distributor ID:', error);
        res.status(500).json({ message: 'Failed to fetch QR code', error: error.toString() });
    }
};
const updateQRCodeOnScan = async (req, res) => {
    const { distributorId, orderId, location } = req.body; // Data from the request body
    console.log("hi1",location);

    try {
        // Find the QR code based on distributorId and orderId
        const qrCode = await QRCode.findOne({ distributorId, orderId });
        if (!qrCode) {
            return res.status(404).json({ message: 'QR Code not found for the given distributor and order' });
        }

        // Update QR code fields
        qrCode.location = location || qrCode.location; // Update location if provided
        qrCode.accessDate = new Date(); // Set access date to current date when scanned

        // Save the updated QR code
        await qrCode.save();

        res.status(200).json({ message: 'QR Code updated successfully', qrCode });
    } catch (error) {
        console.error('Error updating QR code on scan:', error);
        res.status(500).json({ message: 'Failed to update QR code', error: error.toString() });
    }
};

module.exports = { getQRCodeById, getQRCodeByOrderAndDistributor, updateQRCodeOnScan };