const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authenticateToken'); // Path to your authentication middleware
const dash = require('../../controllers/manufacturers/dash'); // Path to your controller

// Define the route for calculating totals for a specific manufacturer
router.get('/calculate-totals', authenticateToken, dash.calculateTotals);

module.exports = router;