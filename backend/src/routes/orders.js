const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public routes (accessible to authenticated users)
router.get('/', authenticateToken, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);

// Guest route for creating orders (for local testing)
router.post('/', createOrder);

// Protected routes for authenticated users
// router.post('/', authenticateToken, createOrder);

// Protected routes - only for admin or delivery staff to update status
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'driver'), updateOrderStatus);

module.exports = router;