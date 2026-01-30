const { Sequelize } = require('sequelize');

// SQLite database configuration
// Initialize Sequelize with the sqlite package directly
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './timedrop.sqlite', // SQLite file will be created in the project root
  logging: console.log, // Enable logging in development, set to false in production
  define: {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    underscored: true, // Use snake_case for field names
  },
  dialectModule: require('sqlite'),
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