const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Check tables
db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error querying tables:', err.message);
      return;
    }
    console.log('Tables in database:');
    tables.forEach(table => {
      console.log('- ' + table.name);
    });
  });
  
  // Check drivers
  db.all("SELECT * FROM drivers", (err, drivers) => {
    if (err) {
      console.error('Error querying drivers:', err.message);
      return;
    }
    console.log('\nDrivers in database:');
    drivers.forEach(driver => {
      console.log(`- ID: ${driver.id}, Name: ${driver.name}, Phone: ${driver.phone}`);
    });
  });
  
  // Check customers
  db.all("SELECT * FROM customers", (err, customers) => {
    if (err) {
      console.error('Error querying customers:', err.message);
      return;
    }
    console.log('\nCustomers in database:');
    customers.forEach(customer => {
      console.log(`- ID: ${customer.id}, Name: ${customer.name}, Phone: ${customer.phone}`);
    });
  });
  
  // Check orders
  db.all("SELECT * FROM orders", (err, orders) => {
    if (err) {
      console.error('Error querying orders:', err.message);
      return;
    }
    console.log('\nOrders in database:');
    orders.forEach(order => {
      console.log(`- ID: ${order.id}, Order ID: ${order.order_id}, Customer: ${order.customer_name}, Status: ${order.status}`);
    });
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('\nDatabase connection closed.');
  }
});