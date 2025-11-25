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

// Check drivers table structure
db.all('PRAGMA table_info(drivers)', (err, rows) => {
  if (err) {
    console.error('Error checking drivers table structure:', err.message);
  } else {
    console.log('Drivers table structure:');
    console.table(rows);
  }
  
  // Check drivers data
  db.all('SELECT * FROM drivers', async (err, rows) => {
    if (err) {
      console.error('Error checking drivers data:', err.message);
    } else {
      console.log('Drivers data:');
      for (const row of rows) {
        console.log(`ID: ${row.id}, Name: ${row.name}, Phone: ${row.phone}`);
        console.log(`Password hash: ${row.password_hash}`);
        
        // Verify password
        try {
          const isMatch = await bcrypt.compare('driver123', row.password_hash);
          console.log(`Password verification for 'driver123': ${isMatch}`);
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
});