const express = require('express');
const router = express.Router();
const retailAuthController = require('../../controllers/retailer/RetailController');

// Registration route
router.post('/register', retailAuthController.registerUser);

// Login route
router.post('/login', retailAuthController.loginUser);

// Logout route
router.post('/logout', retailAuthController.logoutUser);

// Refresh token route
router.post('/refreshToken', retailAuthController.refreshToken);

module.exports = router;
