'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        order_id: 'AMZ-45210',
        customer_name: 'Rahul Mehta',
        phone: '9876543210',
        address: 'Hyderabad, India',
        pincode: '500001',
        lat: 17.3850,
        lng: 78.4867,
        slot_date: null,
        slot_time: null,
        status: 'Pending Slot Selection',
        assigned_driver_id: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        order_id: 'AMZ-45211',
        customer_name: 'Priya Sharma',
        phone: '9876543212',
        address: 'Hyderabad, India',
        pincode: '500001',
        lat: 17.3851,
        lng: 78.4868,
        slot_date: null,
        slot_time: null,
        status: 'Pending Slot Selection',
        assigned_driver_id: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};