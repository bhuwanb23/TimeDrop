const jwt = require('jsonwebtoken');
const { Driver } = require('../models');

/**
 * JWT-based authentication middleware
 * Verifies the JWT token and attaches the user to the request object
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if the Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Check if the token is in the correct format (Bearer token)
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Bearer token.'
      });
    }
    
    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the driver from the database to ensure they still exist
    const driver = await Driver.findByPk(decoded.id);
    
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Driver not found.'
      });
    }
    
    // Attach the driver to the request object
    req.driver = driver;
    req.driverId = decoded.id;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    // For any other errors, return a generic error message
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Role-based access control middleware
 * Checks if the authenticated user has the required role
 * @param {Array} roles - Array of allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user is authenticated
    if (!req.driver) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
    }
    
    // Check if the user's role is in the allowed roles
    // For now, we only have drivers, but this can be extended
    const userRole = 'driver'; // In a more complex system, this would come from the user object
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    // Continue to the next middleware or route handler
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles
};