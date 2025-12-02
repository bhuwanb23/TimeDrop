const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/dbConnectionTest');
const { sequelize } = require('./models');
const ordersRoutes = require('./routes/ordersRoutes');
const customersRoutes = require('./routes/customersRoutes');
const driversRoutes = require('./routes/driversRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
const { rateLimiter } = require('./middleware/rateLimiter');
const { globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Apply rate limiting to all requests
app.use(rateLimiter());

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/auth', authRoutes);

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

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});