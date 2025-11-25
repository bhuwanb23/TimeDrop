const crypto = require('crypto');

// In a real implementation, these would come from environment variables or a config file
const COURIER_CALLBACK_URL = process.env.COURIER_CALLBACK_URL || 'https://courier-system.example.com/api/orders/status';
const CALLBACK_AUTH_TOKEN = process.env.CALLBACK_AUTH_TOKEN || 'default-auth-token';

/**
 * Send callback to courier system
 * @param {Object} order - Order object
 * @param {string} status - New status
 * @returns {Object} - Callback result
 */
const sendCourierCallback = async (order, status) => {
  try {
    // Prepare callback data
    const callbackData = {
      order_id: order.order_id,
      status: status,
      timestamp: new Date().toISOString(),
      customer_name: order.customer_name,
      phone: order.phone
    };

    // Add authentication header
    const authHeader = generateAuthHeader(callbackData);

    // In a real implementation, this would make an HTTP request to the courier system
    console.log('Sending callback to courier system:', {
      url: COURIER_CALLBACK_URL,
      data: callbackData,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Simulate successful response
    const response = {
      success: true,
      message: 'Callback sent successfully',
      orderId: order.order_id,
      status: status
    };

    // Log successful callback
    logCallbackAttempt(order.order_id, status, true, response);

    return response;
  } catch (error) {
    console.error('Error sending courier callback:', error);

    // Log failed callback
    logCallbackAttempt(order.order_id, status, false, { error: error.message });

    // Handle retry logic
    return handleCallbackRetry(order, status, error);
  }
};

/**
 * Generate authentication header for callback
 * @param {Object} data - Callback data
 * @returns {string} - Authentication header
 */
const generateAuthHeader = (data) => {
  // Simple HMAC-based authentication
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac('sha256', CALLBACK_AUTH_TOKEN);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  
  return `HMAC ${signature}`;
};

/**
 * Log callback attempt
 * @param {string} orderId - Order ID
 * @param {string} status - Status
 * @param {boolean} success - Whether the callback was successful
 * @param {Object} response - Response data
 */
const logCallbackAttempt = (orderId, status, success, response) => {
  const logEntry = {
    orderId,
    status,
    success,
    timestamp: new Date().toISOString(),
    response: response || null
  };

  console.log('Courier callback log:', logEntry);
  
  // In a real implementation, this would save to a database
  // For now, we're just logging to console
};

/**
 * Handle callback retry logic
 * @param {Object} order - Order object
 * @param {string} status - Status
 * @param {Object} error - Error object
 * @returns {Object} - Retry result
 */
const handleCallbackRetry = async (order, status, error) => {
  // In a real implementation, this would implement exponential backoff
  // and retry logic with a queue system
  
  console.log(`Retry logic would be implemented here for order ${order.order_id}`);
  
  return {
    success: false,
    message: 'Callback failed. Retry logic would be implemented in production.',
    error: error.message,
    orderId: order.order_id,
    status: status
  };
};

/**
 * Validate callback authentication
 * @param {string} authHeader - Authentication header
 * @param {Object} payload - Callback payload
 * @returns {boolean} - Whether authentication is valid
 */
const validateCallbackAuth = (authHeader, payload) => {
  if (!authHeader || !authHeader.startsWith('HMAC ')) {
    return false;
  }

  const providedSignature = authHeader.substring(5); // Remove 'HMAC ' prefix
  const payloadString = JSON.stringify(payload);
  
  const hmac = crypto.createHmac('sha256', CALLBACK_AUTH_TOKEN);
  hmac.update(payloadString);
  const expectedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(providedSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

module.exports = {
  sendCourierCallback,
  generateAuthHeader,
  logCallbackAttempt,
  handleCallbackRetry,
  validateCallbackAuth
};