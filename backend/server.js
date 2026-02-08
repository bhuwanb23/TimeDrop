require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./src/config/database');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const deliveryRoutes = require('./src/routes/deliveries');
const routeRoutes = require('./src/routes/routes');
const whatsappRoutes = require('./src/routes/whatsapp');

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/webhooks', whatsappRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'TimeDrop Backend API', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      deliveries: '/api/deliveries',
      routes: '/api/routes',
      whatsapp: '/api/webhooks'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Sync database and start server
const startServer = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Set up model associations after sequelize instance is ready
    require('./src/models/associations');
    
    // Sync all models - using force: false to avoid data loss but handle constraints properly
    // For SQLite, we need to handle foreign keys carefully
    try {
      // Disable foreign key checks for SQLite
      await sequelize.query('PRAGMA foreign_keys = OFF');
      
      // Sync without forcing to preserve data but update structure
      await sequelize.sync({ force: false });
      
      // Re-enable foreign key checks
      await sequelize.query('PRAGMA foreign_keys = ON');
    } catch (syncError) {
      console.error('Sync error, attempting alternative method:', syncError.message);
      
      // If sync fails, try with force disabled foreign keys
      await sequelize.query('PRAGMA foreign_keys = OFF');
      await sequelize.sync({ force: false });
      await sequelize.query('PRAGMA foreign_keys = ON');
    }
    
    console.log('Database synchronized.');

    // Try to listen on PORT; if in use, try next ports up to PORT+10
    const tryListen = (port) => {
      const server = app.listen(port, () => {
        console.log(`TimeDrop server is running on port ${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
        if (port !== PORT) {
          console.log(`(Port ${PORT} was in use; using ${port} instead.)`);
          console.log(`If using the app, set EXPO_PUBLIC_API_URL=http://localhost:${port}/api or update api.js base URL.`);
        }
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && port < PORT + 10) {
          console.log(`Port ${port} in use, trying ${port + 1}...`);
          tryListen(port + 1);
        } else {
          console.error(`Cannot bind to port ${port}. Stop the process using it (e.g. taskkill /PID <pid> /F) or set PORT in .env.`);
          process.exit(1);
        }
      });
    };
    tryListen(PORT);
  } catch (error) {
    console.error('Unable to connect to database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;