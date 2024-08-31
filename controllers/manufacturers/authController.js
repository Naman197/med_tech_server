const Manufacturer = require('../../models/manufacturers/user'); // Import the Manufacturer model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Controller function for manufacturer registration
exports.registerManufacturer = async (req, res) => {
    try {
        const { fullName, organizationName, emailAddress, phoneNumber, password, address } = req.body;

        // Check if the manufacturer already exists
        const existingManufacturer = await Manufacturer.findOne({ emailAddress });
        if (existingManufacturer) {
            return res.status(400).json({ message: 'Manufacturer already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new manufacturer
        const newManufacturer = new Manufacturer({
            fullName,
            organizationName,
            emailAddress,
            phoneNumber,
            password: hashedPassword,
            address,
            role: 'Manufacturer'
        });

        // Handle uploaded documents
        if (req.files) {
            newManufacturer.uploadedDocuments = req.files.map(file => file.path);
        }

        // Save the manufacturer to the database
        await newManufacturer.save();

        res.status(201).json({ message: 'Manufacturer registered successfully.', manufacturerId: newManufacturer._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Controller function for manufacturer login
exports.loginManufacturer = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;

        // Find the manufacturer by email
        const manufacturer = await Manufacturer.findOne({ emailAddress });
        if (!manufacturer) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if the hashed password exists and compare
        if (!manufacturer.password || !manufacturer.password) {
            return res.status(500).json({ message: 'Password not set for this manufacturer.' });
        }
        
        const isMatch = await bcrypt.compare(password, manufacturer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: manufacturer._id, role: manufacturer.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Send response with token and user details
        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: manufacturer._id,
                fullName: manufacturer.fullName || null,
                organizationName: manufacturer.organizationName || null,
                emailAddress: manufacturer.emailAddress || null,
                phoneNumber: manufacturer.phoneNumber || {
                    countryCode: null,
                    number: null
                },
                role: manufacturer.role || 'Manufacturer',
                address: manufacturer.address || {
                    street: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null
                },
                manufacturerId: manufacturer.manufacturerId || null,
                licenseNumber: manufacturer.licenseNumber || null,
                businessRegistrationNumber: manufacturer.businessRegistrationNumber || null,
                typesOfProductsSupplied: manufacturer.typesOfProductsSupplied || [],
                preferredPaymentMethod: manufacturer.preferredPaymentMethod || null,
                bankAccountDetails: manufacturer.bankAccountDetails || null,
                alternateContactInformation: manufacturer.alternateContactInformation || null,
                uploadedDocuments: manufacturer.uploadedDocuments || [],
                agreeToTermsAndConditions: manufacturer.agreeToTermsAndConditions || false
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Controller function for password reset
exports.resetPassword = async (req, res) => {
    try {
        const { emailAddress, newPassword } = req.body;

        // Find the manufacturer by email
        const manufacturer = await Manufacturer.findOne({ emailAddress });
        if (!manufacturer) {
            return res.status(400).json({ message: 'Manufacturer not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the manufacturer's password
        manufacturer.password.hashedPassword = hashedPassword;
        await manufacturer.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        // Get the user ID from the authenticated token
        const userId = req.user.id;

        const { fullName, organizationName, phoneNumber, address, licenseNumber, preferredPaymentMethod } = req.body;

        // Find the manufacturer by user ID
        let manufacturer = await Manufacturer.findById(userId);
        if (!manufacturer) {
            return res.status(404).json({ message: 'Manufacturer not found.' });
        }

        // Update the manufacturer details
        if (fullName) manufacturer.fullName = fullName;
        if (organizationName) manufacturer.organizationName = organizationName;
        if (phoneNumber) manufacturer.phoneNumber = phoneNumber;
        if (address) manufacturer.address = address;
        if (licenseNumber) manufacturer.licenseNumber = licenseNumber;
        if (preferredPaymentMethod) manufacturer.preferredPaymentMethod = preferredPaymentMethod;

        // Handle uploaded documents
        if (req.files) {
            // Optionally, remove the old documents if necessary
            if (manufacturer.uploadedDocuments && manufacturer.uploadedDocuments.length > 0) {
                manufacturer.uploadedDocuments.forEach(file => {
                    fs.unlinkSync(path.join(__dirname, '../../', file));
                });
            }
            manufacturer.uploadedDocuments = req.files.map(file => file.path);
        }

        // Save the updated manufacturer details
        await manufacturer.save();

        res.status(200).json({ message: 'Profile updated successfully.', manufacturer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during profile update.' });
    }
};