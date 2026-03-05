require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');
const Delivery = require('./src/models/Delivery');
const Address = require('./src/models/Address');

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
    
    // Create sample categories with better images
    const categoriesData = [
      {
        name: 'Electronics',
        description: 'Electronic devices, gadgets, and accessories',
        image_url: 'https://images.unsplash.com/photo-1468495244123-6c6ef332ad7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'active'
      },
      {
        name: 'Home & Living',
        description: 'Home decor, furniture, and kitchen items',
        image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'active'
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories',
        image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'active'
      },
      {
        name: 'Beauty & Health',
        description: 'Cosmetics, skincare, and wellness products',
        image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'active'
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment, outdoor gear, and fitness products',
        image_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        status: 'active'
      }
    ];
    
    for (const categoryData of categoriesData) {
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
      
      if (created) {
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }
    
    // Fetch all categories to use for product assignment
    const categories = await Category.findAll();
    
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 129.00,
        stock_quantity: 50,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: categories.find(c => c.name === 'Electronics').id,
        status: 'active'
      },
      {
        name: 'Smart Watch Series 7',
        description: 'Latest smartwatch with health monitoring features',
        price: 199.00,
        stock_quantity: 30,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: categories.find(c => c.name === 'Electronics').id,
        status: 'active'
      },
      {
        name: 'Minimalist Lamp',
        description: 'Modern minimalist desk lamp with adjustable brightness',
        price: 45.00,
        stock_quantity: 25,
        image_url: 'https://images.unsplash.com/photo-1588345933685-60647725d5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: categories.find(c => c.name === 'Home & Living').id,
        status: 'active'
      },
      {
        name: 'Leather Jacket',
        description: 'Premium genuine leather jacket for men',
        price: 120.00,
        stock_quantity: 15,
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: categories.find(c => c.name === 'Fashion').id,
        status: 'active'
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        stock_quantity: 40,
        image_url: 'https://images.unsplash.com/photo-1613047508032-34a0d5935d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        category_id: categories.find(c => c.name === 'Electronics').id,
        status: 'active'
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
    
    // Fetch users
    const driverUser = await User.findOne({ where: { email: 'driver@example.com' } });
    const customerUser = await User.findOne({ where: { email: 'customer@example.com' } });
    const adminUserRecord = await User.findOne({ where: { email: 'admin@example.com' } });
    const additionalDriverRecord = await User.findOne({ where: { email: 'driver2@example.com' } });
    
    // Create sample address
    const [address] = await Address.findOrCreate({
      where: { 
        user_id: customerUser.id,
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        country: 'USA'
      },
      defaults: {
        user_id: customerUser.id,
        type: 'home',
        first_name: 'Jane',
        last_name: 'Customer',
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        country: 'USA',
        phone: '+0987654321',
        is_default: true
      }
    });
    
    console.log('Created sample address');
    
    // Fetch products
    const products = await Product.findAll();
    
    // Create sample orders
    const sampleOrders = [
      {
        order_number: 'ORD-98210',
        customer_id: customerUser.id,
        total_amount: 174.00,
        status: 'assigned',
        delivery_address: JSON.stringify({
          street: '452 Oak Avenue',
          city: 'Downtown Core',
          state: 'CA',
          zip_code: '94103',
          country: 'USA'
        })
      },
      {
        order_number: 'ORD-98211',
        customer_id: customerUser.id,
        total_amount: 199.00,
        status: 'pending',
        delivery_address: JSON.stringify({
          street: '1200 Innovation Way, Suite 400',
          city: 'Tech District',
          state: 'CA',
          zip_code: '94105',
          country: 'USA'
        })
      },
      {
        order_number: 'ORD-98215',
        customer_id: customerUser.id,
        total_amount: 79.99,
        status: 'assigned',
        delivery_address: JSON.stringify({
          street: '89 Sunset Blvd, Apt 4C',
          city: 'Mission Bay',
          state: 'CA',
          zip_code: '94107',
          country: 'USA'
        })
      }
    ];
    
    const createdOrders = [];
    for (const orderData of sampleOrders) {
      const [order, created] = await Order.findOrCreate({
        where: { order_number: orderData.order_number },
        defaults: orderData
      });
      
      if (created) {
        console.log(`Created order: ${order.order_number}`);
        createdOrders.push(order);
        
        // Add order items (1-2 random products per order)
        const numItems = Math.floor(Math.random() * 2) + 1;
        const selectedProducts = [];
        
        for (let i = 0; i < numItems; i++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          if (!selectedProducts.includes(randomProduct)) {
            selectedProducts.push(randomProduct);
            await OrderItem.create({
              order_id: order.id,
              product_id: randomProduct.id,
              quantity: Math.floor(Math.random() * 2) + 1,
              price: randomProduct.price
            });
          }
        }
      } else {
        console.log(`Order already exists: ${order.order_number}`);
        createdOrders.push(order);
      }
    }
    
    // Create sample deliveries
    const sampleDeliveries = [
      {
        order_id: createdOrders[0].id,
        driver_id: driverUser.id,
        status: 'in_transit',
        pickup_location: JSON.stringify({
          street: '100 Warehouse Rd',
          city: 'Industrial Area',
          state: 'CA',
          zip_code: '94100',
          country: 'USA'
        }),
        dropoff_location: createdOrders[0].delivery_address,
        earnings: 12.40
      },
      {
        order_id: createdOrders[1].id,
        driver_id: driverUser.id,
        status: 'assigned',
        pickup_location: JSON.stringify({
          street: '100 Warehouse Rd',
          city: 'Industrial Area',
          state: 'CA',
          zip_code: '94100',
          country: 'USA'
        }),
        dropoff_location: createdOrders[1].delivery_address,
        earnings: 15.00
      },
      {
        order_id: createdOrders[2].id,
        driver_id: driverUser.id,
        status: 'assigned',
        pickup_location: JSON.stringify({
          street: '100 Warehouse Rd',
          city: 'Industrial Area',
          state: 'CA',
          zip_code: '94100',
          country: 'USA'
        }),
        dropoff_location: createdOrders[2].delivery_address,
        earnings: 8.50
      }
    ];
    
    for (const deliveryData of sampleDeliveries) {
      const [delivery, created] = await Delivery.findOrCreate({
        where: { order_id: deliveryData.order_id },
        defaults: deliveryData
      });
      
      if (created) {
        console.log(`Created delivery for order: ${deliveryData.order_id}`);
      } else {
        console.log(`Delivery already exists for order: ${deliveryData.order_id}`);
      }
    }
    
    // Create some completed deliveries for statistics
    const completedDelivery = await Delivery.findOrCreate({
      where: { order_id: 999 }, // Use non-existent order ID to avoid conflicts
      defaults: {
        order_id: 999,
        driver_id: driverUser.id,
        status: 'delivered',
        pickup_location: JSON.stringify({
          street: '100 Warehouse Rd',
          city: 'Industrial Area',
          state: 'CA',
          zip_code: '94100',
          country: 'USA'
        }),
        dropoff_location: JSON.stringify({
          street: '722 West End Ave, Apt 12B',
          city: 'Richmond District',
          state: 'CA',
          zip_code: '94118',
          country: 'USA'
        }),
        earnings: 18.50,
        actual_delivery_time: new Date()
      }
    });
    
    if (completedDelivery[0]) {
      console.log('Created sample completed delivery');
    }
    
    console.log('Database seeded successfully!');
    console.log('\n=== Seeding Summary ===');
    console.log(`Users: ${await User.count()}`);
    console.log(`Categories: ${await Category.count()}`);
    console.log(`Products: ${await Product.count()}`);
    console.log(`Orders: ${await Order.count()}`);
    console.log(`Deliveries: ${await Delivery.count()}`);
    console.log('\nTest Credentials:');
    console.log('Driver: driver@example.com / password123');
    console.log('Customer: customer@example.com / customer123');
    console.log('Admin: admin@example.com / admin123');
    await sequelize.close(); // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();