const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrderById,
  selectSlot,
  updateOrderStatus,
  assignDriver,
  autoAssignDrivers
} = require('../controllers/ordersController');
const { validateOrderCreation, validateSlotSelection, validateDriverAssignment } = require('../middleware/validationMiddleware');

// POST /api/orders/new - Receive new order from courier
router.post('/new', validateOrderCreation, createOrder);

// GET /api/orders/:id - View order details
router.get('/:id', getOrderById);

// PUT /api/orders/:id/select-slot - Customer selects delivery slot
router.put('/:id/select-slot', validateSlotSelection, selectSlot);

// PUT /api/orders/:id/update-status - Driver updates delivery status
router.put('/:id/update-status', updateOrderStatus);

// PUT /api/orders/:id/assign-driver - Assign driver manually
router.put('/:id/assign-driver', validateDriverAssignment, assignDriver);

// POST /api/orders/auto-assign - Automatically assign drivers
router.post('/auto-assign', autoAssignDrivers);

module.exports = router;