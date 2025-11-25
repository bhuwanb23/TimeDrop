const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Function to insert test data
async function insertTestData() {
  try {
    // Hash passwords
    const driverPassword = await bcrypt.hash('driver123', 10);
    const customerPassword = 'customer123'; // Customers don't have passwords in this schema
    
    // Insert test drivers
    const drivers = [
      {
        name: 'John Driver',
        phone: '9876543210',
        password_hash: driverPassword,
        current_lat: 17.3850,
        current_lng: 78.4867
      },
      {
        name: 'Jane Driver',
        phone: '9876543211',
        password_hash: driverPassword,
        current_lat: 17.3851,
        current_lng: 78.4868
      }
    ];
    
    // Insert test customers
    const customers = [
      {
        name: 'Rahul Mehta',
        phone: '9876543213'
      },
      {
        name: 'Priya Sharma',
        phone: '9876543214'
      }
    ];
    
    // Insert drivers
    for (const driver of drivers) {
      db.run(`INSERT OR IGNORE INTO drivers (name, phone, password_hash, current_lat, current_lng, created_at, updated_at) 
              VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`, 
              [driver.name, driver.phone, driver.password_hash, driver.current_lat, driver.current_lng], 
              function(err) {
        if (err) {
          console.error('Error inserting driver:', err.message);
        } else {
          console.log(`Driver ${driver.name} inserted with ID: ${this.lastID}`);
        }
      });
    }
    
    // Insert customers
    for (const customer of customers) {
      db.run(`INSERT OR IGNORE INTO customers (name, phone, created_at, updated_at) 
              VALUES (?, ?, datetime('now'), datetime('now'))`, 
              [customer.name, customer.phone], 
              function(err) {
        if (err) {
          console.error('Error inserting customer:', err.message);
        } else {
          console.log(`Customer ${customer.name} inserted with ID: ${this.lastID}`);
        }
      });
    }
    
    console.log('Test data insertion completed.');
    
  } catch (error) {
    console.error('Error inserting test data:', error.message);
  }
}

// Run the function
insertTestData();

// Close the database connection after a delay to ensure inserts complete
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}, 1000);