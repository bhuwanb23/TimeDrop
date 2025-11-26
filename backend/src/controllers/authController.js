const jwt = require('jsonwebtoken');
const { Customer, Driver } = require('../models');

const formatResponseData = (userType, entity) => {
  if (userType === 'driver') {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      current_lat: entity.current_lat,
      current_lng: entity.current_lng,
    };
  }

  return {
    id: entity.id,
    name: entity.name,
    phone: entity.phone,
    email: entity.email,
  };
};

const login = async (req, res) => {
  try {
    const { phone, password, userType } = req.body;
    const Model = userType === 'driver' ? Driver : Customer;
    const userLabel = userType === 'driver' ? 'Driver' : 'Customer';

    const entity = await Model.findOne({ where: { phone } });

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: `${userLabel} not found`,
      });
    }

    const isPasswordValid = await entity.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: entity.id,
        phone: entity.phone,
        role: userType,
      },
      process.env.JWT_SECRET || 'delivery_slot_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      userType,
      data: formatResponseData(userType, entity),
      token,
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  login,
};

