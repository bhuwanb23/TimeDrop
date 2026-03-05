const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');
const { getDriverStatistics, getAllDeliveries, getDeliveryById, assignDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');

// Helper function to get deliveries by driver
const getDeliveriesByDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'ASC' } = req.query;
    
    // Build where clause
    let whereClause = { driver_id: driverId };
    
    if (status) {
      whereClause.status = status;
    }
    
    // Fetch deliveries with pagination and include order details
    const deliveries = await Delivery.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total_amount', 'status'],
          include: [{
            model: User,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          }]
        },
        {
          model: User,
          as: 'driver',
          attributes: ['id', 'name', 'phone']
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(deliveries.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Driver deliveries retrieved successfully',
      data: {
        deliveries: deliveries.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalDeliveries: deliveries.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get driver deliveries error:', error);
    res.status(500).json({ error: 'Failed to retrieve driver deliveries' });
  }
};

// All routes are public for local development (no authentication)
router.get('/statistics', getDriverStatistics); // Get driver stats/dashboard data
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.get('/driver/:driverId', getDeliveriesByDriver); // Get deliveries by driver ID

// Write operations (also public for local development)
router.post('/assign', assignDelivery);
router.put('/:id/status', updateDeliveryStatus);

module.exports = router;