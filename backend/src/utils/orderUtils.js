/**
 * Utility functions for order management
 */

// Generate a unique order number
function generateOrderNumber() {
  const prefix = 'TD';
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}-${timestamp}-${randomSuffix}`;
}

// Validate delivery address format
function validateDeliveryAddress(address) {
  const requiredFields = ['street', 'city', 'state', 'zip_code', 'country'];
  
  for (const field of requiredFields) {
    if (!address[field]) {
      throw new Error(`Delivery address must include ${field}`);
    }
  }
  
  return true;
}

// Calculate total order amount from items
function calculateOrderTotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order items must be a non-empty array');
  }
  
  let total = 0;
  for (const item of items) {
    if (!item.unit_price || !item.quantity) {
      throw new Error('Each order item must have unit_price and quantity');
    }
    
    const itemTotal = parseFloat(item.unit_price) * parseInt(item.quantity);
    if (isNaN(itemTotal)) {
      throw new Error(`Invalid price or quantity for item: ${JSON.stringify(item)}`);
    }
    
    total += itemTotal;
  }
  
  return parseFloat(total.toFixed(2));
}

// Check if order can be modified based on status
function canModifyOrder(status) {
  const modifiableStatuses = ['pending', 'confirmed', 'processing'];
  return modifiableStatuses.includes(status);
}

// Check if order can be cancelled based on status
function canCancelOrder(status) {
  const cancelableStatuses = ['pending', 'confirmed'];
  return cancelableStatuses.includes(status);
}

module.exports = {
  generateOrderNumber,
  validateDeliveryAddress,
  calculateOrderTotal,
  canModifyOrder,
  canCancelOrder
};