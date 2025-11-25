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

// Add email column to customers table
db.run('ALTER TABLE customers ADD COLUMN email VARCHAR(255)', (err) => {
  if (err) {
    console.error('Error adding email column:', err.message);
  } else {
    console.log('Email column added successfully');
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