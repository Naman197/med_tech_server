const jwt = require('jsonwebtoken');

// Hard-coded secret key
const SECRET_KEY = '1234';

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  console.log(token);

  if (token == null) return res.status(401).json({ error: 'Token required' }); // No token provided

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' }); // Invalid token
     console.log(user);
    req.user = user; // Add the user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
