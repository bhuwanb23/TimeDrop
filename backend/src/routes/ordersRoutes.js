const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  selectSlot,
  updateOrderStatus
} = require('../controllers/ordersController');

// POST /api/orders/new - Receive new order from courier
router.post('/new', createOrder);

// GET /api/orders/:id - View order details
router.get('/:id', getOrderById);

// PUT /api/orders/:id/select-slot - Customer selects delivery slot
router.put('/:id/select-slot', selectSlot);

// PUT /api/orders/:id/update-status - Driver updates delivery status
router.put('/:id/update-status', updateOrderStatus);

module.exports = router;