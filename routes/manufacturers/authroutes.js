const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const manufacturersAuthController = require('../../controllers/manufacturers/authController.js');
const authenticateToken = require('../../middleware/authenticateToken'); // Assuming this is your middleware

// Route for manufacturer registration with file upload handling
router.post('/register', upload.array('documents', 10), manufacturersAuthController.registerManufacturer);

// Route for manufacturer login
router.post('/login', manufacturersAuthController.loginManufacturer);

// Route for password reset (if required)
router.post('/reset-password', manufacturersAuthController.resetPassword);

// Route for updating manufacturer profile with file upload handling
router.put('/update-profile', authenticateToken, upload.array('documents', 10), manufacturersAuthController.updateProfile);
router.get('/profile', authenticateToken, manufacturersAuthController.getProfile);

module.exports = router;
