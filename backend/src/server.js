const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/dbConnectionTest');
const { sequelize } = require('./models');
const ordersRoutes = require('./routes/ordersRoutes');
const customersRoutes = require('./routes/customersRoutes');
const driversRoutes = require('./routes/driversRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/drivers', driversRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Delivery Slot Selection & Route Optimization System API' });
});

// Database connection
connectDB();

// Sync database models
sequelize.sync()
  .then(() => {
    console.log('Database models synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database models:', error);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});