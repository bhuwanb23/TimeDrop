const { Order, Driver } = require('../models');

/**
 * Group deliveries by pincode
 * @param {Array} orders - Array of order objects
 * @returns {Object} - Grouped orders by pincode
 */
const groupByPincode = (orders) => {
  return orders.reduce((groups, order) => {
    const pincode = order.pincode;
    if (!groups[pincode]) {
      groups[pincode] = [];
    }
    groups[pincode].push(order);
    return groups;
  }, {});
};

/**
 * Sort deliveries by latitude and longitude (simple proximity sorting)
 * @param {Array} orders - Array of order objects
 * @returns {Array} - Sorted orders
 */
const sortByLocation = (orders) => {
  // Simple sorting by lat then lng as a basic proximity approximation
  return orders.sort((a, b) => {
    if (a.lat === b.lat) {
      return a.lng - b.lng;
    }
    return a.lat - b.lat;
  });
};

/**
 * Assign deliveries to drivers using round-robin approach
 * @param {Array} orders - Array of order objects
 * @param {Array} drivers - Array of driver objects
 * @returns {Array} - Orders with assigned drivers
 */
const assignDeliveriesToDrivers = async (orders, drivers) => {
  if (!drivers || drivers.length === 0) {
    console.log('No drivers available for assignment');
    return orders;
  }

  // Sort orders by location for better routing
  const sortedOrders = sortByLocation(orders);
  
  // Assign drivers using round-robin
  const assignedOrders = sortedOrders.map((order, index) => {
    const driverIndex = index % drivers.length;
    return {
      ...order.dataValues || order,
      assigned_driver_id: drivers[driverIndex].id
    };
  });

  return assignedOrders;
};

/**
 * Optimize deliveries for distance-based sorting
 * @param {Array} orders - Array of order objects
 * @returns {Array} - Optimized order sequence
 */
const optimizeForDistance = (orders) => {
  // This is a simplified version - in a real implementation, 
  // this would use a more sophisticated routing algorithm
  // For now, we'll sort by location as a basic optimization
  return sortByLocation(orders);
};

/**
 * Main function to group and assign deliveries
 * @param {Array} orders - Array of order objects
 * @returns {Object} - Grouping results
 */
const groupAndAssignDeliveries = async (orders) => {
  try {
    // Group by pincode
    const pincodeGroups = groupByPincode(orders);
    
    // Get all available drivers
    const drivers = await Driver.findAll();
    
    // Process each pincode group
    const results = {};
    
    for (const [pincode, pincodeOrders] of Object.entries(pincodeGroups)) {
      // Sort by location
      const sortedOrders = sortByLocation(pincodeOrders);
      
      // Optimize for distance
      const optimizedOrders = optimizeForDistance(sortedOrders);
      
      // Assign to drivers
      const assignedOrders = await assignDeliveriesToDrivers(optimizedOrders, drivers);
      
      results[pincode] = {
        orders: assignedOrders,
        driverCount: drivers.length,
        orderCount: assignedOrders.length
      };
    }
    
    return {
      success: true,
      groups: results,
      totalDrivers: drivers.length,
      totalOrders: orders.length
    };
  } catch (error) {
    console.error('Error in groupAndAssignDeliveries:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  groupByPincode,
  sortByLocation,
  assignDeliveriesToDrivers,
  optimizeForDistance,
  groupAndAssignDeliveries
};