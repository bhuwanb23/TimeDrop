# Quick Fixes - Step by Step Instructions

## Prerequisites
1. **Install Node.js** from https://nodejs.org/ (LTS version)
2. After installation, open NEW PowerShell window to verify:
   ```powershell
   node --version
   npm --version
   ```

---

## 🔴 CRITICAL FIXES (Do These First)

### Fix 1: Product Search Bug (iLike → like)

**File:** `backend\src\controllers\productController.js`
**Line:** 17

**Current Code:**
```javascript
whereClause.name = { [Op.iLike]: `%${search}%` }; // Using iLike for case-insensitive search
```

**Change To:**
```javascript
whereClause.name = { [Op.like]: `%${search}%` }; // SQLite uses LIKE (case-insensitive by default)
```

---

### Fix 2: Order Customer ID Issue

**File:** `backend\src\controllers\orderController.js`
**Line:** 113

**Current Code:**
```javascript
const DEFAULT_CUSTOMER_ID = 4; // Using the guest customer we created
```

**Change To:**
```javascript
const DEFAULT_CUSTOMER_ID = 2; // Using the customer user created in seed
```

---

### Fix 3: Delivery Address Format

The backend stores delivery_address as JSON:
```json
{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "country": "USA"
}
```

But frontend expects different fields. We need to update the screens.

**File:** `App\screens\MyOrdersScreen.js`
**Lines:** 141-143

**Current Code:**
```javascript
<Text style={styles.deliveryAddress} numberOfLines={1}>
    {order.delivery_address.full_name}, {order.delivery_address.city}
</Text>
```

**Change To:**
```javascript
<Text style={styles.deliveryAddress} numberOfLines={1}>
    {order.delivery_address.street}, {order.delivery_address.city}
</Text>
```

---

**File:** `App\screens\OrderDetailScreen.js`
**Lines:** 276-283

**Current Code:**
```javascript
<Text style={styles.infoValue}>
    {order.delivery_address?.full_name}
</Text>
<Text style={styles.infoValue}>
    {order.delivery_address?.address}, {order.delivery_address?.city}
</Text>
<Text style={styles.infoValue}>
    {order.delivery_address?.state} {order.delivery_address?.zip}
</Text>
```

**Change To:**
```javascript
<Text style={styles.infoValue}>
    {order.delivery_address?.street}
</Text>
<Text style={styles.infoValue}>
    {order.delivery_address?.city}, {order.delivery_address?.state} {order.delivery_address?.zip}
</Text>
<Text style={styles.infoValue}>
    {order.delivery_address?.country}
</Text>
```

Also add phone field check at line 292:
```javascript
// Change from: {order.delivery_address?.phone}
// To: {order.delivery_address?.phone || 'Not provided'}
```

---

## 🟢 SETUP COMMANDS (After Fixes)

### Backend Setup
Open PowerShell and run:
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\backend"
npm install
npm run seed
npm start
```

**Expected Output:**
```
Database connected successfully.
Tables synchronized.
Sample user created: John Driver
Sample customer created: Jane Customer
...
TimeDrop server is running on 0.0.0.0:3000
```

Keep this terminal open!

---

### App Setup
Open NEW PowerShell window and run:
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\App"
npm install
npm start
```

**Expected Output:**
```
Starting project at ...
Expo DevTools is running at http://localhost:19002
```

Then:
- Press `w` to open in web browser, OR
- Scan QR code with Expo Go app on your phone

---

## 🧪 TESTING CHECKLIST

Once everything is running, test:

### Customer Flow:
- [ ] Login with customer@example.com / customer123
- [ ] Browse products
- [ ] Search for products
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Go to checkout
- [ ] Enter delivery address
- [ ] Place order
- [ ] Check "My Orders" tab - order should appear
- [ ] Click order to see details

### Driver Flow:
- [ ] Login with driver@example.com / password123
- [ ] View dashboard
- [ ] Check deliveries tab
- [ ] See assigned deliveries

---

## 🐛 TROUBLESHOOTING

### If Backend Won't Start:

**Error: Port 3000 in use**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=3001
```

**Error: Cannot find module**
```powershell
# Delete and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

**Error: Database constraint failed**
```powershell
# Delete database and reseed
rm timedrop.sqlite
npm run seed
```

---

### If App Won't Start:

**Error: Cannot find module**
```powershell
# Delete and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

**Error: Can't connect to backend**
1. Make sure backend is running (check terminal)
2. Verify `App/.env` has: `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
3. On physical device, replace localhost with your computer's IP

**Changes not showing**
- Shake device → select "Reload"
- Or press `r` in terminal
- For hard reset, press `R` (capital)

---

## 📊 WHAT TO DO NEXT

After running the commands and testing:

1. **If everything works:** Great! Move to implementing missing features
2. **If something breaks:** Check error messages and refer to troubleshooting section
3. **If you need help:** Share the error messages/screenshots

---

## 📝 FILES SUMMARY

### Files Already Created (No Action Needed):
- ✅ `backend/.env` - Backend environment config
- ✅ `App/.env` - App environment config  
- ✅ `SETUP_GUIDE.md` - Complete setup instructions
- ✅ `MISSING_PARTS_ANALYSIS.md` - Detailed analysis

### Files Needing Fixes:
1. `backend/src/controllers/productController.js` - Line 17
2. `backend/src/controllers/orderController.js` - Line 113
3. `App/screens/MyOrdersScreen.js` - Line 142
4. `App/screens/OrderDetailScreen.js` - Lines 276-283, 292

### Files to Verify Later:
- CategoryScreen.js
- WishlistScreen.js
- CustomerProfileScreen.js
- LoginScreen.js
- DashboardScreen.js
- DeliveryScreen.js
- RouteScreen.js

---

Ready? Start with installing Node.js, then run the setup commands!
Let me know if you encounter any issues.
