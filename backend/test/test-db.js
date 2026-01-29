// Simple test script to verify database connection
require('dotenv').config();
const { sequelize } = require('../src/config/database');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful!');
    
    // Close connection
    await sequelize.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();