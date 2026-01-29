const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'confirmed', 'processing', 
      'assigned', 'picked_up', 'in_transit', 
      'delivered', 'cancelled', 'returned'
    ),
    defaultValue: 'pending'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  delivery_address: {
    type: DataTypes.JSON, // Store as JSON {street, city, state, zip, country}
    allowNull: false
  },
  delivery_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.ENUM('cash_on_delivery', 'credit_card', 'debit_card', 'digital_wallet'),
    defaultValue: 'cash_on_delivery'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  delivery_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimated_delivery_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_delivery_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivery_person_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tracking_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;