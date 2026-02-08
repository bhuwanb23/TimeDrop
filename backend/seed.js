require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Authenticate with the database first
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models to create tables
    await sequelize.sync();
    console.log('Tables synchronized.');
    
    // Hash the password
    const driverPasswordHash = await bcrypt.hash('password123', 10);
    
    // Create sample user
    const sampleUser = await User.findOrCreate({
      where: { email: 'driver@example.com' },
      defaults: {
        name: 'John Driver',
        email: 'driver@example.com',
        password: driverPasswordHash,
        phone: '+1234567890',
        role: 'driver',
        status: 'active'
      }
    });
    
    console.log('Sample user created:', sampleUser[0].name);
    
    // Hash the password
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    
    // Create sample customer
    const sampleCustomer = await User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        name: 'Jane Customer',
        email: 'customer@example.com',
        password: customerPasswordHash,
        phone: '+0987654321',
        role: 'customer',
        status: 'active'
      }
    });
    
    console.log('Sample customer created:', sampleCustomer[0].name);
    
    // Create additional sample users
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const additionalDriverPasswordHash = await bcrypt.hash('driverpass', 10);
    
    const adminUser = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPasswordHash,
        phone: '+1111111111',
        role: 'admin',
        status: 'active'
      }
    });
    
    const additionalDriver = await User.findOrCreate({
      where: { email: 'driver2@example.com' },
      defaults: {
        name: 'Jane Driver',
        email: 'driver2@example.com',
        password: additionalDriverPasswordHash,
        phone: '+2222222222',
        role: 'driver',
        status: 'active'
      }
    });
    
    console.log('Additional users created:', adminUser[0].name, 'and', additionalDriver[0].name);
    
    // Create sample products
    const electronicsCategory = await Category.findOrCreate({
      where: { name: 'Electronics' },
      defaults: {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        status: 'active'
      }
    });
    
    const homeCategory = await Category.findOrCreate({
      where: { name: 'Home' },
      defaults: {
        name: 'Home',
        description: 'Home and kitchen items',
        status: 'active'
      }
    });
    
    const fashionCategory = await Category.findOrCreate({
      where: { name: 'Fashion' },
      defaults: {
        name: 'Fashion',
        description: 'Clothing and accessories',
        status: 'active'
      }
    });
    
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 129.00,
        stock_quantity: 50,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.5
      },
      {
        name: 'Smart Watch Series 7',
        description: 'Latest smartwatch with health monitoring features',
        price: 199.00,
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.7
      },
      {
        name: 'Minimalist Lamp',
        description: 'Modern minimalist desk lamp with adjustable brightness',
        price: 45.00,
        stock_quantity: 25,
        image_url: 'https://images.unsplash.com/photo-1588345933685-60647725d5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: homeCategory[0].id,
        status: 'active',
        rating: 4.3
      },
      {
        name: 'Leather Jacket',
        description: 'Premium genuine leather jacket for men',
        price: 120.00,
        stock_quantity: 15,
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: fashionCategory[0].id,
        status: 'active',
        rating: 4.6
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        stock_quantity: 40,
        image_url: 'https://images.unsplash.com/photo-1613047508032-34a0d5935d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.4
      }
    ];
    
    for (const productData of sampleProducts) {
      const [product, created] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData
      });
      
      if (created) {
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }
    
    console.log('Database seeded successfully!');
    await sequelize.close(); // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();