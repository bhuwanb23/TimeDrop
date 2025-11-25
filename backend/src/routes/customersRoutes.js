const express = require('express');
const router = express.Router();
const { getCustomerOrdersByPhone } = require('../controllers/customersController');

// GET /api/customers/orders?phone= - Get customer orders by phone
router.get('/orders', getCustomerOrdersByPhone);

module.exports = router;