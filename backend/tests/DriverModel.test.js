const { Driver } = require('../src/models');
const { sequelize } = require('../src/models');
const bcrypt = require('bcryptjs');

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn((password, salt) => Promise.resolve('hashed-password')),
  compare: jest.fn((candidatePassword, hash) => Promise.resolve(true))
}));

describe('Driver Model', () => {
  beforeAll(async () => {
    // Sync the database before running tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close();
  });

  describe('Driver Validation', () => {
    it('should create a valid driver', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: '9876543210',
        password_hash: 'driver123',
        lat: 17.3850,
        lng: 78.4867
      };

      const driver = await Driver.create(driverData);
      
      expect(driver.name).toBe(driverData.name);
      expect(driver.phone).toBe(driverData.phone);
      // Password should be hashed (check that it's not the original value)
      expect(driver.password_hash).not.toBe(driverData.password_hash);
    });

    it('should enforce unique phone constraint', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: '9876543211',
        password_hash: 'driver123'
      };

      // Create the first driver
      await Driver.create(driverData);
      
      // Try to create another driver with the same phone
      await expect(Driver.create(driverData)).rejects.toThrow();
    });

    it('should validate required fields including lat/lng', async () => {
      const driverData = {
        // Missing required fields
        name: 'Test Driver'
      };

      await expect(Driver.create(driverData)).rejects.toThrow();
    });

    it('should validate phone number format', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: 'invalid-phone',
        password_hash: 'driver123'
      };

      await expect(Driver.create(driverData)).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: '9876543212',
        password_hash: 'driver123'
      };

      // This should succeed as all required fields are present
      const driver = await Driver.create(driverData);
      expect(driver).toBeDefined();
    });
  });

  describe('Driver Password Handling', () => {
    it('should hash password before saving', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: '9876543213',
        password_hash: 'driver123'
      };

      const driver = await Driver.create(driverData);
      
      // Check that the password was hashed (not the same as original)
      expect(driver.password_hash).toBeDefined();
      expect(driver.password_hash).not.toBe('driver123');
    });

    it('should validate password correctly', async () => {
      const driverData = {
        name: 'Test Driver',
        phone: '9876543214',
        password_hash: 'driver123'
      };

      const driver = await Driver.create(driverData);
      
      // Test valid password
      const isValid = await driver.comparePassword('driver123');
      expect(isValid).toBe(true);
      
      // Test invalid password
      const isInvalid = await driver.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });
  });
});