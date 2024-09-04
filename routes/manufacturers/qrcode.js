// routes/qrCodeRoutes.js

const express = require('express');
const router = express.Router();
const qrCodeController = require('../../controllers/manufacturers/qrCode');
const  authenticateToken  = require('../../middleware/authenticateToken'); // Import middleware

// Route to get QR code by ID
router.get('/:id', qrCodeController.getQRCodeById);

// Route to get QR code by order ID and distributor ID
router.get('/qrcodes', authenticateToken, qrCodeController.getQRCodeByOrderAndDistributor);

router.put('/qrcodes/scan',qrCodeController.updateQRCodeOnScan);

module.exports = router;
