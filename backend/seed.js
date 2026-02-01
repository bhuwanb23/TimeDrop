require('dotenv').config();
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Authenticate with the database first
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models to create tables
    await sequelize.sync();
    console.log('Tables synchronized.');
    
    // Create sample user
    const sampleUser = await User.findOrCreate({
      where: { email: 'driver@example.com' },
      defaults: {
        name: 'John Driver',
        email: 'driver@example.com',
        password: 'hashed_password_placeholder', // In real app, this would be bcrypt hashed
        phone: '+1234567890',
        role: 'driver',
        status: 'active'
      }
    });
    
    console.log('Sample user created:', sampleUser[0].name);
    
    // Create sample customer
    const sampleCustomer = await User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        name: 'Jane Customer',
        email: 'customer@example.com',
        password: 'hashed_password_placeholder', // In real app, this would be bcrypt hashed
        phone: '+0987654321',
        role: 'customer',
        status: 'active'
      }
    });
    
    console.log('Sample customer created:', sampleCustomer[0].name);
    
    console.log('Database seeded successfully!');
    await sequelize.close(); // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();