const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Customer name is required'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: /^[0-9]{10}$/,
        msg: 'Phone number must be a 10-digit number'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Address is required'
      }
    }
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Pincode is required'
      },
      is: {
        args: /^[0-9]{6}$/,
        msg: 'Pincode must be a 6-digit number'
      }
    }
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Latitude must be a decimal number'
      }
    }
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Longitude must be a decimal number'
      }
    }
  },
  slot_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Slot date must be a valid date'
      }
    }
  },
  slot_time: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending Slot Selection',
    validate: {
      notEmpty: {
        msg: 'Status is required'
      },
      isIn: {
        args: [[
          'Pending Slot Selection',
          'Slot Selected',
          'Assigned to Driver',
          'Out for Delivery',
          'Delivered',
          'Customer Not Available',
          'Rescheduled'
        ]],
        msg: 'Status must be a valid order status'
      }
    }
  },
  assigned_driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'drivers',
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;