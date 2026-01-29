const express = require('express');
const router = express.Router();
const { getAllDeliveries, getDeliveryById, assignDelivery, updateDeliveryStatus } = require('../controllers/deliveryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes (accessible to authenticated users)
router.get('/', authenticateToken, getAllDeliveries);
router.get('/:id', authenticateToken, getDeliveryById);

// Protected routes - only for admin and drivers
router.post('/assign', authenticateToken, authorizeRoles('admin'), assignDelivery);
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'driver'), updateDeliveryStatus);

module.exports = router;