const express = require('express');
const router = express.Router();
const {
  driverLogin,
  getDriverDeliveries,
  updateDriverLocation,
  updateOrderStatus
} = require('../controllers/driversController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

// POST /api/driver/login - Driver authentication
router.post('/login', authRateLimiter, driverLogin);

// GET /api/drivers/:id/deliveries - Get driver's assigned deliveries
router.get('/:id/deliveries', authenticateJWT, authorizeRoles('driver'), getDriverDeliveries);

// PUT /api/drivers/:id/update-location - Update driver's current location
router.put('/:id/update-location', authenticateJWT, authorizeRoles('driver'), updateDriverLocation);

// PUT /api/drivers/:id/orders/:orderId/status - Update order status
router.put('/:id/orders/:orderId/status', authenticateJWT, authorizeRoles('driver'), updateOrderStatus);

module.exports = router;