# TimeDrop - Setup and Running Instructions

## Prerequisites Installation

### 1. Install Node.js (Required)

**Step 1:** Download Node.js
- Go to: https://nodejs.org/
- Download the **LTS version** (Long Term Support) - recommended for most users
- Choose the Windows Installer (.msi) - 64-bit or 32-bit depending on your system

**Step 2:** Install Node.js
- Run the downloaded installer
- Follow the installation wizard:
  - Accept the license agreement
  - Use default installation path (C:\Program Files\nodejs\)
  - Check "Automatically install the necessary tools" if asked
  - Click Install

**Step 3:** Verify Installation
Open a **NEW** PowerShell window (important to reload PATH) and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

If you see the versions, Node.js is installed correctly!

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\backend"
```

### Step 2: Install Dependencies
```powershell
npm install
```

This will install all required packages including:
- Express (web framework)
- Sequelize (ORM)
- SQLite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- And other dependencies

### Step 3: Seed the Database
```powershell
npm run seed
```

This creates:
- Sample users (customer and driver accounts)
- Sample categories (Electronics, Home, Fashion)
- Sample products with images

**Expected Output:**
```
Seeding database...
Database connection established.
Tables synchronized.
Sample user created: John Driver
Sample customer created: Jane Customer
Additional users created: Admin User and Jane Driver
Created product: Wireless Headphones
Created product: Smart Watch Series 7
...
Database seeded successfully!
```

### Step 4: Start the Backend Server
```powershell
npm start
```

**Expected Output:**
```
Attempting to connect to database...
Database connected successfully.
Database synchronized.
TimeDrop server is running on 0.0.0.0:3000
Health check: http://localhost:3000/health
Reachable on this machine at http://localhost:3000 and on your network at http://<YOUR_IP>:3000
```

**Keep this terminal open!** The backend server needs to stay running.

---

## Mobile App Setup

### Step 1: Open New Terminal
Open a **NEW** PowerShell window (keep backend running in the first one)

### Step 2: Navigate to App Directory
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\App"
```

### Step 3: Install Dependencies
```powershell
npm install
```

This installs:
- React Native & Expo
- Navigation libraries
- Map components
- AsyncStorage
- Axios (API calls)
- And other dependencies

### Step 4: Start the App
```powershell
npm start
```

This will:
- Start Expo DevTools
- Open a browser window with the Expo interface
- Show QR code for scanning

### Step 5: Run on Your Device

**Option A: Using Expo Go App (Recommended)**
1. Install **Expo Go** app on your phone:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Scan the QR code:
   - Android: Use the Expo Go app to scan
   - iOS: Use the Camera app to scan

**Option B: Using Simulator/Emulator**
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (Mac only)

**Option C: Web Browser**
- Press `w` to open in web browser

---

## Test Credentials

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123

### Driver Account
- **Email:** driver@example.com
- **Password:** password123

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123

---

## Testing the Full Flow

### 1. Customer App Features to Test:
✅ Browse products by category
✅ Search and filter products
✅ Add products to cart
✅ Update cart quantities
✅ Proceed to checkout
✅ Enter delivery address
✅ Select payment method
✅ Place order
✅ View order history (My Orders tab)
✅ View order details

### 2. Driver App Features to Test:
✅ Login as driver
✅ View dashboard with stats
✅ See assigned deliveries
✅ Change delivery status
✅ View earnings

---

## Troubleshooting

### Backend Issues

**Problem:** Port 3000 already in use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3001
```

**Problem:** Database connection error
```powershell
# Delete existing database file
rm timedrop.sqlite

# Re-run seed
npm run seed
```

**Problem:** Module not found
```powershell
# Delete node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### App Issues

**Problem:** Can't connect to backend
1. Make sure backend is running (check terminal)
2. Verify `.env` file has correct URL:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```
3. If using physical device, replace `localhost` with your computer's IP:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
   ```
   Find your IP with: `ipconfig`

**Problem:** Expo won't start
```powershell
# Clear cache
npm start --clear

# Or reset project
rm -r node_modules
rm package-lock.json
npm install
npm start
```

**Problem:** Changes not showing
- Shake your device and select "Reload"
- Or press `r` in the terminal
- For hard reset, press `R` (capital)

---

## API Testing

You can test the backend API directly using these endpoints:

### Health Check
```
GET http://localhost:3000/health
```

### Get All Products
```
GET http://localhost:3000/api/products
```

### Get Single Product
```
GET http://localhost:3000/api/products/1
```

### Get All Orders
```
GET http://localhost:3000/api/orders
```

### Create Order (POST with JSON body)
```
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "customer_id": 2,
  "total_amount": 174.00,
  "delivery_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "unit_price": 129.00
    },
    {
      "product_id": 3,
      "quantity": 1,
      "unit_price": 45.00
    }
  ]
}
```

Use tools like:
- Postman
- Insomnia
- curl command
- Browser (for GET requests)

---

## Next Steps After Setup

Once everything is running:

1. **Test Customer Flow:**
   - Browse products
   - Add to cart
   - Complete checkout
   - Verify order appears in database

2. **Test Driver Features:**
   - Login as driver
   - View deliveries
   - Update delivery status

3. **Verify Data Persistence:**
   - Close and restart app
   - Cart should persist
   - Orders should remain

4. **Test on Physical Device:**
   - Update `.env` with your IP
   - Test on your phone

---

## Development Tips

### Hot Reload
- Changes to JavaScript files automatically reload
- Keep both terminals open while developing

### Debugging
- Use `console.log()` for debugging
- View logs in Expo DevTools browser
- Check backend terminal for API logs

### Database Inspection
The SQLite database file is at:
```
c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\backend\timedrop.sqlite
```

Use DB Browser for SQLite to inspect:
https://sqlitebrowser.org/

---

## Summary of Commands

### Backend
```powershell
cd backend
npm install          # Install dependencies
npm run seed         # Seed database
npm start            # Start server
```

### App
```powershell
cd App
npm install          # Install dependencies
npm start            # Start Expo
```

---

## What's Already Done ✅

- ✅ Complete backend API with all endpoints
- ✅ Database models and associations
- ✅ Authentication system
- ✅ Product catalog with categories
- ✅ Shopping cart management
- ✅ Checkout flow
- ✅ Order placement
- ✅ Order history
- ✅ Driver dashboard
- ✅ Delivery management
- ✅ Environment configuration

---

## What Needs Testing 🧪

- Full customer order flow
- Backend API integration
- Cart persistence
- Order tracking
- Driver features
- Real-time updates

---

Need help? Check the detailed documentation in `/docs` folder!
