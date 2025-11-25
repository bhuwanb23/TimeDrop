const { Order } = require('../models');

// Define all possible order statuses
const ORDER_STATUSES = [
  'Pending Slot Selection',
  'Slot Selected',
  'Out for Delivery',
  'Delivered',
  'Customer Not Available',
  'Rescheduled'
];

// Define valid status transitions
const VALID_STATUS_TRANSITIONS = {
  'Pending Slot Selection': ['Slot Selected', 'Rescheduled'],
  'Slot Selected': ['Out for Delivery', 'Rescheduled'],
  'Out for Delivery': ['Delivered', 'Customer Not Available', 'Rescheduled'],
  'Customer Not Available': ['Rescheduled'],
  'Rescheduled': ['Out for Delivery', 'Delivered'],
  'Delivered': [] // Final state, no transitions allowed
};

/**
 * Validate status transition
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - New order status
 * @returns {boolean} - Whether the transition is valid
 */
const validateStatusTransition = (currentStatus, newStatus) => {
  // If current status is not in our defined transitions, allow any transition
  if (!VALID_STATUS_TRANSITIONS[currentStatus]) {
    return true;
  }
  
  // Check if the new status is in the allowed transitions
  return VALID_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
};

/**
 * Log status change
 * @param {number} orderId - Order ID
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {string} userId - User ID making the change (optional)
 * @returns {Object} - Log entry
 */
const logStatusChange = (orderId, oldStatus, newStatus, userId = null) => {
  const logEntry = {
    orderId,
    oldStatus,
    newStatus,
    timestamp: new Date().toISOString(),
    userId
  };
  
  // In a real implementation, this would save to a database
  console.log('Status change log:', logEntry);
  
  return logEntry;
};

/**
 * Send notification for status change
 * @param {Object} order - Order object
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 */
const sendStatusNotification = (order, oldStatus, newStatus) => {
  // In a real implementation, this would send SMS, email, or push notifications
  console.log(`Notification: Order ${order.order_id} status changed from ${oldStatus} to ${newStatus}`);
  console.log(`Sending notification to customer: ${order.customer_name} (${order.phone})`);
  
  // Placeholder for actual notification logic
  // This could integrate with SMS services, email services, etc.
};

/**
 * Get all possible order statuses
 * @returns {Array} - Array of order statuses
 */
const getAllOrderStatuses = () => {
  return [...ORDER_STATUSES];
};

/**
 * Get valid transitions for a status
 * @param {string} status - Current status
 * @returns {Array} - Array of valid transitions
 */
const getValidTransitions = (status) => {
  return VALID_STATUS_TRANSITIONS[status] || [];
};

module.exports = {
  ORDER_STATUSES,
  VALID_STATUS_TRANSITIONS,
  validateStatusTransition,
  logStatusChange,
  sendStatusNotification,
  getAllOrderStatuses,
  getValidTransitions
};