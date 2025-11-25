const express = require('express');
const router = express.Router();
const {
  driverLogin,
  getDriverDeliveries,
  updateDriverLocation,
  updateOrderStatus
} = require('../controllers/driversController');

// POST /api/driver/login - Driver authentication
router.post('/login', driverLogin);

// GET /api/drivers/:id/deliveries - Get driver's assigned deliveries
router.get('/:id/deliveries', getDriverDeliveries);

// PUT /api/drivers/:id/update-location - Update driver's current location
router.put('/:id/update-location', updateDriverLocation);

// PUT /api/drivers/:id/orders/:orderId/status - Update order status
router.put('/:id/orders/:orderId/status', updateOrderStatus);

module.exports = router;