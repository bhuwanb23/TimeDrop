const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
});

// Add password_hash column to customers table
db.run('ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT ""', (err) => {
  if (err) {
    console.error('Error adding column:', err.message);
  } else {
    console.log('Column added successfully');
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