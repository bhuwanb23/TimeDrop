const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/dbConnectionTest');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Delivery Slot Selection & Route Optimization System API' });
});

// Database connection
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});