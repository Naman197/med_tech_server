const RetailUser = require('../../models/retailer/retailUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateAccessToken=require('../../utils/generateToken');
// Generate tokens
// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user._id }, 1234, { expiresIn: '45m' }); // Access token expires in 15 minutes
// };

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh token expires in 7 days
};

// User registration
// User registration
// exports.registerUser = async (req, res) => {
//     try {
//       const { name, email, uniqueId, password, role } = req.body; // Include role
  
//       const existingUser = await RetailUser.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email already in use' });
//       }
  
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       const newUser = new RetailUser({
//         name,
//         email,
//         uniqueId,
//         password: hashedPassword,
//         role: role || 'retailer' // Set default role if not provided
//       });
//       console.log(newUser);
//       await newUser.save();
  
//       res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//       res.status(500).json({ error: 'Failed to register user' });
//     }
//   };


exports.registerUser = async (req, res) => {
  try {
      const { 
          fullName, 
          organizationName, 
          emailAddress, 
          phoneNumber = {}, 
          password, 
          address = {}, 
          securityQuestion, 
          securityAnswer, 
          captchaVerification, 
          retailerId, 
          licenseNumber, 
          storeType, 
          hoursOfOperation = {}, 
          typesOfProductsSold = [], 
          paymentMethodsAccepted = [], 
          alternateContactInformation = {}, 
          agreeToTermsAndConditions 
      } = req.body;

      // Check if the user already exists
      const existingUser = await RetailUser.findOne({ emailAddress });
      if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new RetailUser({
          fullName,
          organizationName,
          emailAddress,
          phoneNumber,
          password: hashedPassword,
          address,
          securityQuestion,
          securityAnswer,
          captchaVerification,
          retailerId,
          licenseNumber,
          storeType,
          hoursOfOperation,
          typesOfProductsSold,
          paymentMethodsAccepted,
          alternateContactInformation,
          agreeToTermsAndConditions,
          role: 'Retailer' // Default role as 'Retailer'
      });

      // Handle uploaded documents if any
      if (req.files) {
          newUser.uploadedDocuments = req.files.map(file => file.path);
      }

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to register user' });
  }
};

  
  // User login
  // exports.loginUser = async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  
  //     const user = await RetailUser.findOne({ email });
  //     if (!user) {
  //       return res.status(400).json({ error: 'Invalid email or password' });
  //     }
  
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) {
  //       return res.status(400).json({ error: 'Invalid email or password' });
  //     }
  
  //     console.log(user);
  //     const accessToken = generateAccessToken(user);
  //     // const refreshToken = generateRefreshToken(user);
  //     console.log(accessToken);
  
  //     // Store refresh token in the database (or in-memory for simplicity)
  //     // user.refreshToken = refreshToken;
  //     await user.save();
  
  //     res.status(200).json({
  //       message: 'Login successful',
  //       user,
  //       accessToken,
  //       // refreshToken
  //     });
  //   } catch (err) {
  //     res.status(500).json({ error: 'Failed to login user' });
  //   }
  // };

//   exports.loginUser = async (req, res) => {
//     try {
//         const { emailAddress, password } = req.body; // Changed to emailAddress

//         // Find user by emailAddress
//         const user = await RetailUser.findOne({ email: emailAddress }); // Use emailAddress here
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         // Check if password matches
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         console.log(user);
//         const accessToken = generateAccessToken(user);
//         // const refreshToken = generateRefreshToken(user);
//         console.log(accessToken);

//         // Store refresh token in the database (or in-memory for simplicity)
//         // user.refreshToken = refreshToken;
//         // await user.save();

//         res.status(200).json({
//             message: 'Login successful',
//             user,
//             accessToken,
//             // refreshToken
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to login user' });
//     }
// };

exports.loginUser = async (req, res) => {
  try {
      const { emailAddress, password } = req.body;

      // Find user by emailAddress
      const user = await RetailUser.findOne({ email: emailAddress });
      if (!user) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      console.log('User found:', user);

      // Generate access token
      const accessToken = generateAccessToken(user);
      if (!accessToken) {
          throw new Error('Failed to generate access token');
      }

      console.log('Access Token:', accessToken);

      // Send response with access token
      res.status(200).json({
        message: 'Login successful',
        user,
        token: accessToken, // Change accessToken to token
    });
    
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Failed to login user' });
  }
};
  
// Token refresh
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'Refresh token is required' });

  try {
    const user = await RetailUser.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      user.save();

      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

// User logout
exports.logoutUser = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await RetailUser.findOne({ refreshToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    user.refreshToken = null; // Clear the refresh token
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to logout user' });
  }
};
