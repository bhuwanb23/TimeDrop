const { Order, Customer } = require('../models');
const jwt = require('jsonwebtoken');

// Customer login
const customerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Validate input
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }
    
    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Phone number must be 10 digits.'
      });
    }
    
    // Find customer by phone
    const customer = await Customer.findOne({
      where: {
        phone: phone
      }
    });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Verify password
    const isPasswordValid = await customer.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: customer.id, 
        phone: customer.phone,
        name: customer.name
      },
      process.env.JWT_SECRET || 'delivery_slot_secret',
      { expiresIn: '24h' }
    );
    
    // Return success response with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// GET /api/customers/orders?phone= - Get customer orders by phone
const getCustomerOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    
    // Validate phone number parameter
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }
    
    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Phone number must be 10 digits.'
      });
    }
    
    // Query orders associated with phone number
    const orders = await Order.findAll({
      where: {
        phone: phone
      },
      order: [['created_at', 'DESC']] // Order by creation date, newest first
    });
    
    // Return formatted list of orders
    return res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error retrieving customer orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  customerLogin,
  getCustomerOrdersByPhone
};