'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('driver123', 10);
    
    await queryInterface.bulkInsert('drivers', [
      {
        name: 'John Driver',
        phone: '9876543210',
        password_hash: hashedPassword,
        current_lat: 17.3850,
        current_lng: 78.4867,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Jane Driver',
        phone: '9876543211',
        password_hash: hashedPassword,
        current_lat: 17.3851,
        current_lng: 78.4868,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('drivers', null, {});
  }
};