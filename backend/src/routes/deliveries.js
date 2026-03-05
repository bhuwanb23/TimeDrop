const express = require('express');
const router = express.Router();
const { getDriverStatistics, getAllDeliveries, getDeliveryById, assignDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes (accessible to authenticated users)
// For local project without authentication, removing authenticateToken temporarily
router.get('/statistics', getDriverStatistics); // Get driver stats/dashboard data
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);

// Protected routes - only for admin and drivers
router.post('/assign', assignDelivery);
router.put('/:id/status', updateDeliveryStatus);

module.exports = router;