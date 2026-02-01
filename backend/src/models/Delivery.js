const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending_assignment',
    validate: {
      isIn: [['pending_assignment', 'assigned', 'picked_up', 'in_transit', 'arrived', 'delivered', 'failed', 'returned']]
    }
  },
  pickup_location: {
    type: DataTypes.JSON, // Store as JSON {lat, lng, address}
    allowNull: true
  },
  dropoff_location: {
    type: DataTypes.JSON, // Store as JSON {lat, lng, address}
    allowNull: false
  },
  pickup_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimated_delivery_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_pickup_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_delivery_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivery_proof: {
    type: DataTypes.STRING, // URL or path to photo/screenshot
    allowNull: true
  },
  signature: {
    type: DataTypes.STRING, // URL or path to signature image
    allowNull: true
  },
  qr_code_data: {
    type: DataTypes.STRING, // QR code data for verification
    allowNull: true
  },
  delivery_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  distance: {
    type: DataTypes.DECIMAL(8, 2), // in kilometers or miles
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  }
}, {
  tableName: 'deliveries',
  timestamps: true
});

module.exports = Delivery;