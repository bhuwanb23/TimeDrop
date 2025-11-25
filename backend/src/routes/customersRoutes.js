const express = require('express');
const router = express.Router();
const { customerLogin, getCustomerOrdersByPhone } = require('../controllers/customersController');
const { validateCustomerLogin, validateCustomerOrdersRequest } = require('../middleware/validationMiddleware');

// POST /api/customers/login - Customer login
router.post('/login', validateCustomerLogin, customerLogin);

// GET /api/customers/orders?phone= - Get customer orders by phone
router.get('/orders', validateCustomerOrdersRequest, getCustomerOrdersByPhone);

module.exports = router;