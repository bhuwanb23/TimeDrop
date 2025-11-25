const validator = require('validator');

/**
 * Sanitize input to prevent injection attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Escape HTML characters to prevent XSS
  sanitized = validator.escape(sanitized);
  
  // Remove any null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  return sanitized;
};

/**
 * Sanitize object fields
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Validate required fields middleware
 * @param {Array} requiredFields - Array of required field names
 */
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    try {
      const errors = [];
      
      // Check body fields
      for (const field of requiredFields) {
        if (!req.body[field] || req.body[field] === '') {
          errors.push(`Field '${field}' is required`);
        }
      }
      
      // If there are validation errors, return them
      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      
      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
const validatePhone = (phone) => {
  if (!phone) return false;
  // Indian phone number format (10 digits)
  return validator.isMobilePhone(phone, 'en-IN');
};

/**
 * Validate pincode format
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} - Whether the pincode is valid
 */
const validatePincode = (pincode) => {
  if (!pincode) return false;
  // Indian pincode format (6 digits)
  return /^\d{6}$/.test(pincode);
};

/**
 * Validate coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - Whether the coordinates are valid
 */
const validateCoordinates = (lat, lng) => {
  if (lat === undefined || lng === undefined) return false;
  return validator.isLatLong(`${lat},${lng}`);
};

/**
 * Validation middleware for order creation
 */
const validateOrderCreation = (req, res, next) => {
  try {
    const errors = [];
    const {
      order_id,
      customer_name,
      phone,
      address,
      pincode,
      lat,
      lng
    } = req.body;
    
    // Validate required fields
    if (!order_id) errors.push('Order ID is required');
    if (!customer_name) errors.push('Customer name is required');
    if (!phone) errors.push('Phone number is required');
    if (!address) errors.push('Address is required');
    if (!pincode) errors.push('Pincode is required');
    if (lat === undefined) errors.push('Latitude is required');
    if (lng === undefined) errors.push('Longitude is required');
    
    // Validate phone number format
    if (phone && !validatePhone(phone)) {
      errors.push('Invalid phone number format');
    }
    
    // Validate pincode format
    if (pincode && !validatePincode(pincode)) {
      errors.push('Invalid pincode format (must be 6 digits)');
    }
    
    // Validate coordinates
    if ((lat !== undefined || lng !== undefined) && !validateCoordinates(lat, lng)) {
      errors.push('Invalid coordinates');
    }
    
    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Sanitize inputs
    req.body = sanitizeObject(req.body);
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Order validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during order validation'
    });
  }
};

/**
 * Validation middleware for slot selection
 */
const validateSlotSelection = (req, res, next) => {
  try {
    const errors = [];
    const { slot_date, slot_time } = req.body;
    
    // Validate required fields
    if (!slot_date) errors.push('Slot date is required');
    if (!slot_time) errors.push('Slot time is required');
    
    // Validate date format
    if (slot_date && !validator.isISO8601(slot_date)) {
      errors.push('Invalid date format');
    }
    
    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Sanitize inputs
    req.body = sanitizeObject(req.body);
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Slot selection validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during slot selection validation'
    });
  }
};

module.exports = {
  sanitizeInput,
  sanitizeObject,
  validateRequiredFields,
  validatePhone,
  validatePincode,
  validateCoordinates,
  validateOrderCreation,
  validateSlotSelection
};