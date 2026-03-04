const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'normal',
    validate: {
      isIn: [['low', 'normal', 'high']]
    }
  }
}, {
  tableName: 'wishlist',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'] // Prevent duplicate wishlist entries
    }
  ]
});

module.exports = Wishlist;
