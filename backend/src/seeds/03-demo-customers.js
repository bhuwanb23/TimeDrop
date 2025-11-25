'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('customer123', 10);
    
    await queryInterface.bulkInsert('customers', [
      {
        name: 'Rahul Mehta',
        phone: '9876543213',
        password_hash: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Priya Sharma',
        phone: '9876543214',
        password_hash: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};