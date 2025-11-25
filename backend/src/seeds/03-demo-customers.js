'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('customers', [
      {
        name: 'Rahul Mehta',
        phone: '9876543213',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Priya Sharma',
        phone: '9876543214',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};