const jwt = require('jsonwebtoken');
const { Driver, Order } = require('../models');

// POST /api/driver/login - Driver authentication
const driverLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validate login credentials
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

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

    // Validate driver ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    // Check if driver exists
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Query deliveries assigned to driver
    const deliveries = await Order.findAll({
      where: {
        assigned_driver_id: id
      },
      order: [['slot_date', 'ASC'], ['slot_time', 'ASC']] // Sort by slot date and time
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
    return res.status(200).json({
      success: true,
      data: sortedDeliveries,
      count: sortedDeliveries.length
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

    // Validate driver ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    // Validate location data
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Validate that lat and lng are numbers
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    // Check if driver exists
    const driver = await Driver.findByPk(id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

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

module.exports = {
  driverLogin,
  getDriverDeliveries,
  updateDriverLocation
};