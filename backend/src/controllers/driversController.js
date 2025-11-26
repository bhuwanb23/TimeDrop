const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Driver, Order } = require('../models');
const { validateStatusTransition, logStatusChange, sendStatusNotification } = require('../utils/statusManagement');
const { sendCourierCallback } = require('../utils/courierIntegration');

// POST /api/driver/login - Driver authentication
const driverLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

      // All validation is now handled by middleware

    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Phone number must be 10 digits.'
      });
    }

    // Find driver by phone
    const driver = await Driver.findOne({ where: { phone } });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Compare password
    const isPasswordValid = await driver.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Implement JWT token generation
    const token = jwt.sign(
      { id: driver.id, phone: driver.phone },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return driver information with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        current_lat: driver.current_lat,
        current_lng: driver.current_lng
      },
      token
    });
  } catch (error) {
    console.error('Error during driver login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/drivers/:id/deliveries - Get driver's assigned deliveries
const getDriverDeliveries = async (req, res) => {
  try {
    const { id } = req.params;

    // All validation is now handled by middleware
    // Driver authentication is now handled by middleware
    const driver = req.driver;

    // Query deliveries assigned to driver
    const activeStatuses = [
      'Assigned to Driver',
      'Out for Delivery',
      'Customer Not Available',
      'Rescheduled'
    ];

    const deliveries = await Order.findAll({
      where: {
        assigned_driver_id: id,
        status: {
          [Op.in]: activeStatuses
        }
      },
      order: [['slot_date', 'ASC'], ['slot_time', 'ASC']]
    });

    // Sort deliveries by optimal route (placeholder - in a real implementation, this would use a routing algorithm)
    // For now, we'll just sort by slot date and time as a basic optimization
    const sortedDeliveries = deliveries.sort((a, b) => {
      // This is a placeholder for actual route optimization logic
      // In a real implementation, this would consider distance, traffic, etc.
      return new Date(a.slot_date) - new Date(b.slot_date) || 
             a.slot_time.localeCompare(b.slot_time);
    });

    // Return formatted delivery list
    const formattedDeliveries = sortedDeliveries.map((order) => ({
      id: order.id,
      order_id: order.order_id,
      customer_name: order.customer_name,
      phone: order.phone,
      address: order.address,
      pincode: order.pincode,
      slot_date: order.slot_date,
      slot_time: order.slot_time,
      slot_display: order.slot_date && order.slot_time
        ? `${order.slot_date} • ${order.slot_time}`
        : 'Slot not scheduled',
      status: order.status,
      lat: Number(order.lat),
      lng: Number(order.lng)
    }));

    return res.status(200).json({
      success: true,
      data: formattedDeliveries,
      count: formattedDeliveries.length
    });
  } catch (error) {
    console.error('Error retrieving driver deliveries:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/drivers/update-location - Update driver's current location
const updateDriverLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    // All validation is now handled by middleware
    // Driver authentication is now handled by middleware
    const driver = req.driver;

    // Update driver's current coordinates
    driver.current_lat = lat;
    driver.current_lng = lng;
    await driver.save();

    // Broadcast location to relevant parties (placeholder)
    // In a real implementation, this might use WebSockets or a message queue
    console.log(`Driver ${id} location updated to lat: ${lat}, lng: ${lng}`);

    return res.status(200).json({
      success: true,
      message: 'Driver location updated successfully',
      data: {
        id: driver.id,
        current_lat: driver.current_lat,
        current_lng: driver.current_lng
      }
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// PUT /api/drivers/:id/orders/:orderId/status - Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id, orderId } = req.params;
    const { status } = req.body;
    
      // All validation is now handled by middleware
    
    // Driver authentication is now handled by middleware
    const driver = req.driver;
    
    // Check if order exists and is assigned to this driver
    const order = await Order.findOne({
      where: {
        id: orderId,
        assigned_driver_id: id
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not assigned to this driver'
      });
    }
    
    // Validate status transition
    const oldStatus = order.status;
    if (!validateStatusTransition(oldStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${oldStatus} to ${status}`
      });
    }
    
    order.status = status;
    await order.save();
    
    // Log status change
    logStatusChange(order.id, oldStatus, status, id);
    
    // Send notification
    sendStatusNotification(order, oldStatus, status);
    
    // Notify courier system via callback
    await sendCourierCallback(order, status);
    
    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  driverLogin,
  getDriverDeliveries,
  updateDriverLocation,
  updateOrderStatus
};