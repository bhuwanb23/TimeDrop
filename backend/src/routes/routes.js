const express = require('express');
const router = express.Router();
const { optimizeRoute, getDriverRoute, updateRouteProgress } = require('../controllers/routeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Protected routes - only for admin and drivers
router.post('/optimize', authenticateToken, authorizeRoles('admin', 'driver'), optimizeRoute);
router.get('/driver/:driverId', authenticateToken, getDriverRoute);
router.put('/progress', authenticateToken, authorizeRoles('driver'), updateRouteProgress);

module.exports = router;