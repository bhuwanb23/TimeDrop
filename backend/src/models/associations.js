const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Delivery = require('./Delivery');
const Category = require('./Category');
const Address = require('./Address');

// User associations
User.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
User.hasMany(Delivery, { foreignKey: 'driver_id', as: 'deliveries' });
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });

// Category associations
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_category_id' });

// Product associations
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items' });

// Order associations
Order.belongsTo(User, { foreignKey: 'customer_id', as: 'customer' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
Order.hasOne(Delivery, { foreignKey: 'order_id', as: 'delivery' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Delivery associations
Delivery.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
Delivery.belongsTo(User, { foreignKey: 'driver_id', as: 'driver' });

// Address associations
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Address.hasMany(Order, { foreignKey: 'delivery_address_id', as: 'orders' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Delivery,
  Category,
  Address
};