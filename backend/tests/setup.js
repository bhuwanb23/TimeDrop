// Setup file for Jest tests
const { sequelize } = require('../src/models');

// Set environment to test
process.env.NODE_ENV = 'test';

// Mock console.log to reduce test output noise
console.log = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Close database connections after all tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    // Ignore errors when closing database connection
  }
});