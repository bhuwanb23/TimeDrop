const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes for local project (no authentication required)
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

// Public route for creating orders (no authentication required)
router.post('/', createOrder);

// For local project, comment out admin routes
// router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'driver'), updateOrderStatus);

module.exports = router;