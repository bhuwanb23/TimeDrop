# ✅ Database Setup & Seeding Guide

This guide covers the complete database setup, seeding, and foreign key constraint handling for TimeDrop.

---

## 📦 **1. Delivery Routes - COMPLETE**

**File:** `backend/src/routes/deliveries.js`  
**Status:** ✅ ALL ENDPOINTS IMPLEMENTED

### Available Endpoints:

```javascript
GET /api/deliveries
```
- **Description:** List all deliveries with pagination and filtering
- **Query Parameters:** `page`, `limit`, `status`, `sortBy`, `sortOrder`
- **Authentication:** Optional (for local development)
- **Response:** Deliveries array with order and customer details

```javascript
GET /api/deliveries/:id
```
- **Description:** Get single delivery by ID
- **Parameters:** `id` - Delivery ID
- **Response:** Single delivery with order and driver details

```javascript
GET /api/deliveries/statistics
```
- **Description:** Get driver statistics for dashboard
- **Returns:** Today's earnings, completed trips, acceptance rate, rating, recent activity
- **Note:** Uses default driver ID 1 for local development without auth

```javascript
GET /api/deliveries/driver/:driverId
```
- **Description:** Get all deliveries assigned to a specific driver
- **Parameters:** `driverId` - Driver user ID
- **Query Parameters:** `page`, `limit`, `status`, `sortBy`, `sortOrder`
- **Response:** Driver's deliveries with pagination

```javascript
POST /api/deliveries/assign
```
- **Description:** Assign delivery to a driver
- **Body:** `{ orderId, driverId }`
- **Creates or updates** delivery record

```javascript
PUT /api/deliveries/:id/status
```
- **Description:** Update delivery status
- **Body:** `{ status, actual_pickup_time, actual_delivery_time, delivery_proof, signature }`
- **Also updates** related order status if marked as 'delivered'

---

## 🌱 **2. Database Seeding - COMPLETE**

**File:** `backend/seed.js`  
**Status:** ✅ ENHANCED WITH ORDERS & DELIVERIES

### What Gets Seeded:

#### **Users (4 accounts):**
1. **Driver Account**
   - Email: `driver@example.com`
   - Password: `password123`
   - Role: driver

2. **Customer Account**
   - Email: `customer@example.com`
   - Password: `customer123`
   - Role: customer

3. **Admin Account**
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: admin

4. **Additional Driver**
   - Email: `driver2@example.com`
   - Password: `driverpass`
   - Role: driver

#### **Categories (5 categories):**
- Electronics (with Unsplash image)
- Home & Living (with Unsplash image)
- Fashion (with Unsplash image)
- Beauty & Health (with Unsplash image)
- Sports & Outdoors (with Unsplash image)

#### **Products (5 sample products):**
- Wireless Headphones - $129.00
- Smart Watch Series 7 - $199.00
- Minimalist Lamp - $45.00
- Leather Jacket - $120.00
- Bluetooth Speaker - $79.99

#### **Orders (3 sample orders):**
- ORD-98210 - Status: assigned ($174.00)
- ORD-98211 - Status: pending ($199.00)
- ORD-98215 - Status: assigned ($79.99)

Each order includes:
- Random order items (1-2 products)
- Delivery address (JSON format)
- Customer association

#### **Deliveries (4 sample deliveries):**
- 3 active deliveries (in_transit/assigned)
- 1 completed delivery (delivered status)
- All assigned to driver@example.com
- Includes earnings data

#### **Addresses (1 sample address):**
- Customer's default address
- San Francisco, CA

---

## 🔧 **3. How to Run Seed Script**

### Prerequisites:
1. Node.js installed
2. Backend dependencies installed

### Steps:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not done)
npm install

# Run seed script
npm run seed
```

### Expected Output:
```
Seeding database...
Database connection established.
Tables synchronized.
Sample user created: John Driver
Sample customer created: Jane Customer
Additional users created: Admin User and Jane Driver
Created category: Electronics
Created category: Home & Living
Created category: Fashion
Created category: Beauty & Health
Created category: Sports & Outdoors
Created product: Wireless Headphones
Created product: Smart Watch Series 7
Created product: Minimalist Lamp
Created product: Leather Jacket
Created product: Bluetooth Speaker
Created sample address
Created order: ORD-98210
Created order: ORD-98211
Created order: ORD-98215
Created delivery for order: 1
Created delivery for order: 2
Created delivery for order: 3
Created sample completed delivery
Database seeded successfully!

=== Seeding Summary ===
Users: 4
Categories: 5
Products: 5
Orders: 3
Deliveries: 4

Test Credentials:
Driver: driver@example.com / password123
Customer: customer@example.com / customer123
Admin: admin@example.com / admin123
```

---

## 🔐 **4. Foreign Key Constraints Handling - COMPLETE**

**File:** `backend/src/models/associations.js`  
**File:** `backend/server.js`  
**Status:** ✅ PROPERLY CONFIGURED FOR SQLITE

### SQLite Foreign Key Configuration:

SQLite requires special handling for foreign key constraints. The server properly manages this:

```javascript
// In server.js startServer() function:

// Disable foreign key checks for SQLite
await sequelize.query('PRAGMA foreign_keys = OFF');

// Sync without forcing to preserve data but update structure
await sequelize.sync({ force: false });

// Re-enable foreign key checks
await sequelize.query('PRAGMA foreign_keys = ON');
```

### Why This Matters:

1. **Prevents Orphaned Records:** Foreign keys ensure referential integrity
2. **Cascade Deletes:** When a user is deleted, their orders/deliveries are handled properly
3. **Data Consistency:** Prevents invalid references (e.g., delivery with non-existent order)

### Model Associations Defined:

```javascript
// User associations
User.hasMany(Order, { foreignKey: 'customer_id' })
User.hasMany(Delivery, { foreignKey: 'driver_id' })
User.hasMany(Address, { foreignKey: 'user_id' })
User.hasMany(Wishlist, { foreignKey: 'user_id' })

// Category associations
Category.hasMany(Product, { foreignKey: 'category_id' })

// Product associations
Product.belongsTo(Category, { foreignKey: 'category_id' })
Product.hasMany(OrderItem, { foreignKey: 'product_id' })
Product.hasMany(Wishlist, { foreignKey: 'product_id' })

// Order associations
Order.belongsTo(User, { foreignKey: 'customer_id' })
Order.hasMany(OrderItem, { foreignKey: 'order_id' })
Order.hasOne(Delivery, { foreignKey: 'order_id' })

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id' })
OrderItem.belongsTo(Product, { foreignKey: 'product_id' })

// Delivery associations
Delivery.belongsTo(Order, { foreignKey: 'order_id' })
Delivery.belongsTo(User, { foreignKey: 'driver_id' })

// Address associations
Address.belongsTo(User, { foreignKey: 'user_id' })
Address.hasMany(Order, { foreignKey: 'delivery_address_id' })

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'user_id' })
Wishlist.belongsTo(Product, { foreignKey: 'product_id' })
```

---

## 🎯 **5. Testing the Setup**

### Test API Endpoints:

After running the seed script, test these endpoints:

```bash
# Get all deliveries
curl http://localhost:3000/api/deliveries

# Get deliveries for driver ID 1
curl http://localhost:3000/api/deliveries/driver/1

# Get driver statistics
curl http://localhost:3000/api/deliveries/statistics

# Get specific delivery
curl http://localhost:3000/api/deliveries/1

# Get all categories
curl http://localhost:3000/api/categories

# Get all products
curl http://localhost:3000/api/products
```

### Test Frontend App:

The frontend will now have real data to display:

1. **Driver Dashboard** - Shows statistics from seeded deliveries
2. **Delivery Screen** - Displays 3 active + 1 completed delivery
3. **Route Screen** - Shows route with 3 delivery stops
4. **Category Screen** - Displays 5 categories with images
5. **Product Catalog** - Shows 5 products across categories

---

## ⚠️ **6. Common Issues & Solutions**

### Issue 1: "Table doesn't exist"
**Solution:** Run `npm run seed` to create tables and populate data

### Issue 2: "Foreign key constraint failed"
**Solution:** 
- Server already handles this with PRAGMA statements
- If errors persist, restart the server
- Ensure associations.js is loaded before sync

### Issue 3: "Cannot find module"
**Solution:** 
```bash
cd backend
npm install
```

### Issue 4: "Port already in use"
**Solution:**
- Server automatically tries next available port (3000-3010)
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -i :3000
  kill -9 <PID>
  ```

### Issue 5: Duplicate seed data
**Solution:** 
- Seed script uses `findOrCreate` to prevent duplicates
- To reset completely: delete `timedrop.db` file and re-run seed

---

## 📊 **7. Database Schema Overview**

```
┌─────────────┐
│    User     │
│ - id        │
│ - name      │
│ - email     │
│ - password  │
│ - role      │
│ - phone     │
│ - status    │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬─────────────┐
       │              │              │             │
       ▼              ▼              ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────┐
│    Order    │ │  Delivery   │ │ Address  │ │ Wishlist │
│ - id        │ │ - id        │ │ - id     │ │ - id     │
│ - order_num │ │ - status    │ │ - street │ │ - user   │
│ - customer  │ │ - driver    │ │ - city   │ │ - product│
│ - total     │ │ - order     │ │ - state  │ └──────────┘
└──────┬──────┘ │ - earnings  │ │ - zip    │
       │        └─────────────┘ │ - country│
       │                        └──────────┘
       ▼
┌─────────────┐
│  OrderItem  │
│ - id        │
│ - order     │
│ - product   │
│ - quantity  │
│ - price     │
└─────────────┘

┌─────────────┐
│   Product   │
│ - id        │
│ - name      │
│ - price     │
│ - category  │
│ - stock     │
│ - image_url │
│ - status    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Category  │
│ - id        │
│ - name      │
│ - desc      │
│ - image_url │
│ - status    │
└─────────────┘
```

---

## ✅ **Summary Checklist**

- [x] All delivery endpoints implemented
- [x] Database seed script enhanced with orders/deliveries
- [x] Foreign key constraints properly handled
- [x] Model associations correctly defined
- [x] Sample data includes realistic test scenarios
- [x] Test credentials documented
- [x] Common issues addressed

---

## 🚀 **Quick Start Commands**

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. Run seed script
npm run seed

# 4. Start server
npm start

# OR for development with auto-reload
npm run dev
```

**Server should start on:** `http://localhost:3000`

**Health check:** `http://localhost:3000/health`

**API root:** `http://localhost:3000/api`

---

Your backend is now fully configured with complete data for testing all features! 🎉
