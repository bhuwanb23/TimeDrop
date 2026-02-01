const { Sequelize } = require('sequelize');
require('dotenv').config();

// SQLite database configuration
const sqlite3 = require('sqlite3');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_NAME || './timedrop.sqlite', // SQLite file will be created in the project root
  logging: false, // Disable logging in development to reduce noise
  define: {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    underscored: true, // Use snake_case for field names
  },
  dialectModule: sqlite3,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models and set up associations will be done after DB connection
// This prevents circular dependency issues

module.exports = {
  sequelize,
  connectDB: async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
      
      // Sync all models
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    } catch (error) {
      console.error('Unable to connect to database:', error);
      process.exit(1);
    }
  }
};