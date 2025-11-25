const sequelize = require('../config/database');
const Order = require('./Order');
const Driver = require('./Driver');
const Customer = require('./Customer');

// Define relationships
Order.belongsTo(Driver, {
  foreignKey: 'assigned_driver_id',
  as: 'driver'
});

Driver.hasMany(Order, {
  foreignKey: 'assigned_driver_id',
  as: 'orders'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  Order,
  Driver,
  Customer
};