const jwt = require('jsonwebtoken'); // Import the jwt module

// Function to generate an access token for the user
const generateAccessToken = (user) => {
  try {
    // Check if user object and user._id exist
    if (!user || !user._id) {
      console.error('Error: User object or user ID is missing'); // Console error if user or user ID is missing
      throw new Error('Invalid user data'); // Throw an error to stop further execution
    }

    const SECRET_KEY = '1234'; // Hardcoded secret key

    // Generate the access token
    return jwt.sign(
      { id: user._id },        // Payload containing the user ID
      SECRET_KEY,              // Hardcoded secret key
      { expiresIn: '45m' }     // Access token expires in 45 minutes
    );
  } catch (error) {
    console.error('Error generating access token:', error.message); // Log any error that occurs during token generation
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = generateAccessToken; // Export the function for use in other parts of the application
