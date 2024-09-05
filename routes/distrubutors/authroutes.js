const express = require('express');
const router = express.Router();
const upload = require('../../config/multer'); // Multer for file uploads
const distributorsAuthController = require('../../controllers/distributors/authController');
 const authenticateToken = require('../../middleware/authenticateToken'); // Middleware for token authentication

router.post('/register', upload.array('documents', 10), distributorsAuthController.registerDistributor);

// Route for distributor login
router.post('/login', distributorsAuthController.loginDistributor);

// Route for password reset (if required)
router.post('/reset-password', distributorsAuthController.resetPassword);

// Route for updating distributor profile with file upload handling
router.put('/update-profile', authenticateToken, upload.array('documents', 10), distributorsAuthController.updateProfile);
// Route for fetching distributor profile
router.get('/profile', authenticateToken, distributorsAuthController.getProfile);


module.exports = router;
