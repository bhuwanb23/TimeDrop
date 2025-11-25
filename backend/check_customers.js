const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Open the database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Check customers data
db.all('SELECT * FROM customers', async (err, rows) => {
  if (err) {
    console.error('Error checking customers data:', err.message);
  } else {
    console.log('Customers data:');
    for (const row of rows) {
      console.log(`ID: ${row.id}, Name: ${row.name}, Phone: ${row.phone}, Email: ${row.email}`);
      console.log(`Password hash: ${row.password_hash}`);
      
      // Verify password
      try {
        const isMatch = await bcrypt.compare('customer123', row.password_hash);
        console.log(`Password verification for 'customer123': ${isMatch}`);
      } catch (e) {
        console.error('Error verifying password:', e.message);
      }
    }
  }
  
  // Close the database
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});