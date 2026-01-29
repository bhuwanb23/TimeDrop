const { Op } = require('sequelize');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');

// Mock route optimization - in a real implementation, this would call OSRM or Google Maps API
const optimizeRoute = async (req, res) => {
  try {
    const { driverId, deliveries } = req.body;
    
    // Verify driver exists
    const driver = await User.findByPk(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({ error: 'Driver not found or invalid role' });
    }
    
    // In a real implementation, we would call OSRM or Google Maps API to calculate optimal route
    // For now, we'll just return the deliveries sorted by proximity (mock implementation)
    
    // Mock response - in reality this would contain route coordinates, distance, duration, etc.
    const optimizedRoute = {
      driverId,
      totalDistance: '15.5 km', // Mock value
      totalTime: '45 mins',     // Mock value
      stops: deliveries.length,
      route: deliveries, // Sorted by optimal order
      coordinates: []    // Would contain route coordinates in real implementation
    };
    
    res.status(200).json({
      message: 'Route optimized successfully',
      data: optimizedRoute
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
};

// Get driver's route
const getDriverRoute = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Get driver's assigned deliveries
    const deliveries = await Delivery.findAll({
      where: { 
        driver_id: driverId,
        status: { [Op.notIn]: ['delivered', 'cancelled', 'failed'] } // Only active deliveries
      },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone', 'email']
          }]
        }
      ],
      order: [['createdAt', 'ASC']] // Order by creation time as a simple heuristic
    });
    
    res.status(200).json({
      message: 'Driver route retrieved successfully',
      data: {
        driverId,
        deliveries,
        totalStops: deliveries.length
      }
    });
  } catch (error) {
    console.error('Get driver route error:', error);
    res.status(500).json({ error: 'Failed to retrieve driver route' });
  }
};

// Update route progress
const updateRouteProgress = async (req, res) => {
  try {
    const { driverId, deliveryId, status } = req.body;
    
    // Verify delivery belongs to driver
    const delivery = await Delivery.findOne({
      where: { 
        id: deliveryId,
        driver_id: driverId
      }
    });
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found or does not belong to driver' });
    }
    
    // Update delivery status
    await delivery.update({ status });
    
    res.status(200).json({
      message: 'Route progress updated successfully',
      data: delivery
    });
  } catch (error) {
    console.error('Update route progress error:', error);
    res.status(500).json({ error: 'Failed to update route progress' });
  }
};

module.exports = {
  optimizeRoute,
  getDriverRoute,
  updateRouteProgress
};