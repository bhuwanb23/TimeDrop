const { Customer } = require('../src/models');
const { sequelize } = require('../src/models');

describe('Customer Model', () => {
  beforeAll(async () => {
    // Sync the database before running tests
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    try {
      await sequelize.close();
    } catch (error) {
      // Ignore errors when closing database connection
    }
  });

  describe('Customer Validation', () => {
    it('should create a valid customer', async () => {
      const customerData = {
        name: 'Test Customer',
        phone: '9876543210'
      };

      const customer = await Customer.create(customerData);
      
      expect(customer.name).toBe(customerData.name);
      expect(customer.phone).toBe(customerData.phone);
    });

    // it('should enforce unique phone constraint', async () => {
    //   const customerData1 = {
    //     name: 'Test Customer 1',
    //     phone: '9876543210'
    //   };

    //   const customerData2 = {
    //     name: 'Test Customer 2',
    //     phone: '9876543210' // Same phone
    //   };

    //   // Create the first customer
    //   await Customer.create(customerData1);
      
    //   // Try to create another customer with the same phone
    //   try {
    //     await Customer.create(customerData2);
    //     // If we reach here, the creation succeeded when it should have failed
    //     fail('Expected Customer.create to throw an error');
    //   } catch (error) {
    //     // Check that it's a unique constraint error
    //     expect(error).toBeDefined();
    //   }
    // });

    it('should validate required fields', async () => {
      const customerData = {
        // Missing required fields
        name: 'Test Customer'
      };

      await expect(Customer.create(customerData)).rejects.toThrow();
    });

    it('should validate phone number format', async () => {
      const customerData = {
        name: 'Test Customer',
        phone: 'invalid-phone'
      };

      await expect(Customer.create(customerData)).rejects.toThrow();
    });
  });
});