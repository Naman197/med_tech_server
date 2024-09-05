const Distributor = require('../../models/distributors/distributorUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Controller function for distributor registration
exports.registerDistributor = async (req, res) => {
    try {
        const { 
            fullName, 
            organizationName, 
            emailAddress, 
            phoneNumber = {}, 
            password, 
            address = {}, 
            licenseNumber, 
            securityQuestion, 
            securityAnswer, 
            captchaVerification, 
            distributorId, 
            warehouseLocations = [], 
            vehicleFleetDetails = {}, 
            regionsCovered = [], 
            preferredShippingMethod, 
            alternateContactInformation = {}, 
            agreeToTermsAndConditions 
        } = req.body;

        // Validate required fields
        if (!emailAddress || !password) {
            return res.status(400).json({ message: 'Email address and password are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new distributor
        const newDistributor = new Distributor({
            fullName,
            organizationName,
            emailAddress,
            phoneNumber,
            password: hashedPassword,
            address,
            licenseNumber,
            securityQuestion,
            securityAnswer,
            captchaVerification,
            distributorId,
            warehouseLocations,
            vehicleFleetDetails,
            regionsCovered,
            preferredShippingMethod,
            alternateContactInformation,
            agreeToTermsAndConditions
        });

        // Handle uploaded documents if any
        if (req.files) {
            newDistributor.uploadedDocuments = req.files.map(file => file.path);
        }

        // Save the distributor to the database
        await newDistributor.save();

        res.status(201).json({ message: 'Distributor registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Controller function for distributor login
exports.loginDistributor = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
     
        // Find the distributor by email
        const distributor = await Distributor.findOne({ emailAddress });
        if (!distributor) {
            return res.status(404).json({ message: 'Distributor not found.' });
        }

        // Check if the hashed password exists
        if (!distributor.password ) {
            return res.status(500).json({ message: 'Password not set for this distributor.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, distributor.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: distributor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with token and user details, including handling optional fields
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: distributor._id,
                fullName: distributor.fullName || null,
                emailAddress: distributor.emailAddress || null,
                organizationName: distributor.organizationName || null,
                phoneNumber: distributor.phoneNumber || {
                    countryCode: null,
                    number: null
                },
                role: distributor.role || 'Distributor',
                address: distributor.address || {
                    street: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null
                },
                distributorId: distributor.distributorId || null,
                licenseNumber: distributor.licenseNumber || null,
                warehouseLocations: distributor.warehouseLocations || [],
                vehicleFleetDetails: distributor.vehicleFleetDetails || null,
                regionsCovered: distributor.regionsCovered || [],
                preferredShippingMethod: distributor.preferredShippingMethod || null,
                alternateContactInformation: distributor.alternateContactInformation || null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Controller function for password reset
exports.resetPassword = async (req, res) => {
    // Implement your password reset logic here
};

// Controller function for updating distributor profile
exports.updateProfile = async (req, res) => {
    try {
        // Get the user ID from the authenticated token
        const userId = req.user.id;

        const { fullName, organizationName, phoneNumber, address, licenseNumber } = req.body;

        // Find the distributor by user ID
        let distributor = await Distributor.findById(userId);
        if (!distributor) {
            return res.status(404).json({ message: 'Distributor not found.' });
        }

        // Update the distributor details
        if (fullName) distributor.fullName = fullName;
        if (organizationName) distributor.organizationName = organizationName;
        if (phoneNumber) distributor.phoneNumber = phoneNumber;
        if (address) distributor.address = address;
        if (licenseNumber) distributor.licenseNumber = licenseNumber;

        // Handle uploaded documents
        if (req.files) {
            // Optionally, remove the old documents if necessary
            if (distributor.uploadedDocuments && distributor.uploadedDocuments.length > 0) {
                distributor.uploadedDocuments.forEach(file => {
                    fs.unlinkSync(path.join(__dirname, '../../', file));
                });
            }
            distributor.uploadedDocuments = req.files.map(file => file.path);
        }

        // Save the updated distributor details
        await distributor.save();

        res.status(200).json({ message: 'Profile updated successfully.', distributor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during profile update.' });
    }
};
