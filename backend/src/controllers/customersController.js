const { Order } = require('../models');

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
  getCustomerOrdersByPhone
};