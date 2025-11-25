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

// Check table structure
db.all('PRAGMA table_info(customers)', (err, rows) => {
  if (err) {
    console.error('Error checking table structure:', err.message);
  } else {
    console.log('Customers table structure:');
    console.table(rows);
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