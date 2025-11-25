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

// Function to update test data with passwords
async function updateTestData() {
  try {
    // Hash passwords
    const driverPassword = await bcrypt.hash('driver123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);
    
    // Update existing drivers with passwords
    db.run(`UPDATE drivers SET password_hash = ? WHERE phone = '9876543210'`, 
           [driverPassword], 
           function(err) {
      if (err) {
        console.error('Error updating John Driver:', err.message);
      } else {
        console.log(`John Driver updated with password hash`);
      }
    });
    
    db.run(`UPDATE drivers SET password_hash = ? WHERE phone = '9876543211'`, 
           [driverPassword], 
           function(err) {
      if (err) {
        console.error('Error updating Jane Driver:', err.message);
      } else {
        console.log(`Jane Driver updated with password hash`);
      }
    });
    
    // Update existing customers with passwords
    db.run(`UPDATE customers SET password_hash = ? WHERE phone = '9876543213'`, 
           [customerPassword], 
           function(err) {
      if (err) {
        console.error('Error updating Rahul Mehta:', err.message);
      } else {
        console.log(`Rahul Mehta updated with password hash`);
      }
    });
    
    db.run(`UPDATE customers SET password_hash = ? WHERE phone = '9876543214'`, 
           [customerPassword], 
           function(err) {
      if (err) {
        console.error('Error updating Priya Sharma:', err.message);
      } else {
        console.log(`Priya Sharma updated with password hash`);
      }
    });
    
    console.log('Test data update completed.');
    
  } catch (error) {
    console.error('Error updating test data:', error.message);
  }
}

// Run the function
updateTestData();

// Close the database connection after a delay to ensure updates complete
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}, 1000);