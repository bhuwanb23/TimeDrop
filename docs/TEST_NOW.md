# 🚀 Quick Start - Test Your New Features

## Commands to Run (Copy-Paste)

### Terminal 1 - Backend Server:
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\backend"
npm install
npm run seed
npm start
```

**Keep this terminal running!**

---

### Terminal 2 - Mobile App:
```powershell
cd "c:\Users\bhuwan.bhawarlal\Desktop\projects\TimeDrop\App"
npm install
npm start
```

Then press **`w`** for web browser or scan QR code with Expo Go app.

---

## Test Credentials

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

---

## What to Test

### ✅ Categories Screen (New!)
1. Open app and login
2. Click **"Categories"** tab in bottom navigation
3. You should see 5 categories with beautiful images:
   - Electronics
   - Home & Living
   - Fashion
   - Beauty & Health
   - Sports & Outdoors
4. Pull down to refresh (should reload data)
5. Click on any category → navigates to products filtered by that category

### ✅ Wishlist Screen (New!)
1. Click **"Wishlist"** tab in bottom navigation
2. Initially shows "Your wishlist is empty"
3. To add test data, open Postman or use curl:

**Add Item via API:**
```bash
curl -X POST http://localhost:3000/api/wishlist ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1, \"notes\": \"Test item\", \"priority\": \"normal\"}"
```

4. Refresh the Wishlist screen (pull down)
5. Item should appear
6. Test removing items
7. Test "Clear All" button

---

## Expected Results

### Categories Screen Should:
- ✅ Show 5 category cards with images
- ✅ Display category names
- ✅ Show product count for each category
- ✅ Load data from backend (not hardcoded)
- ✅ Support pull-to-refresh
- ✅ Navigate to filtered products when clicked

### Wishlist Screen Should:
- ✅ Show empty state initially
- ✅ Load items from backend when available
- ✅ Allow removing individual items
- ✅ Allow clearing all items (with confirmation)
- ✅ Support pull-to-refresh
- ✅ Show loading spinner while fetching

---

## Troubleshooting

### Problem: Backend won't start
**Solution:** Check if port 3000 is already in use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: "Cannot find module" errors
**Solution:** Reinstall dependencies
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Problem: Database errors
**Solution:** Delete and recreate database
```powershell
rm timedrop.sqlite
npm run seed
```

### Problem: App can't connect to backend
**Solution:** Verify `.env` file exists in App folder with:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Problem: Categories/Wishlist show empty
**Solution:** Make sure you ran `npm run seed` to populate database

### Problem: Can't add to wishlist
**Solution:** The wishlist requires a valid user. For local testing without auth, it defaults to user ID 2 (the customer). Make sure the customer user exists in database.

---

## Verify Database Has Data

Open SQLite browser or use this command to check:

```bash
sqlite3 backend/timedrop.sqlite "SELECT * FROM categories;"
```

You should see 5 categories.

---

## API Testing with cURL

### Test Categories Endpoint:
```bash
curl http://localhost:3000/api/categories
```

Expected response: JSON with 5 categories

### Test Wishlist Endpoint (Empty):
```bash
curl http://localhost:3000/api/wishlist
```

Expected: Empty array or array with items if you added some

### Add Product to Wishlist:
```bash
curl -X POST http://localhost:3000/api/wishlist ^
  -H "Content-Type: application/json" ^
  -d "{\"productId\": 1}"
```

### Clear Wishlist:
```bash
curl -X DELETE http://localhost:3000/api/wishlist/clear/all
```

---

## Success Indicators ✨

You'll know everything works when:

1. ✅ Backend starts without errors
2. ✅ Database seeds with 5 categories
3. ✅ App loads and you can login
4. ✅ Categories tab shows real data from backend
5. ✅ Wishlist tab loads (empty is OK)
6. ✅ You can add/remove wishlist items via API
7. ✅ No console errors about undefined properties
8. ✅ Loading spinners appear briefly then show content

---

## What's Working Now

### Fully Functional:
- ✅ Category system (backend + frontend)
- ✅ Wishlist system (backend + frontend)
- ✅ Product catalog with search
- ✅ Shopping cart
- ✅ Checkout flow
- ✅ Order placement
- ✅ Order history
- ✅ Order details

### Partially Complete (Needs Your Touch):
- ⚠️ Customer Profile (needs data loading code)
- ⚠️ Category → Products navigation filter
- ⚠️ Add to wishlist from product detail

---

## Next Steps After Testing

Once you confirm the above works:

1. **Complete CustomerProfileScreen** - Add useEffect with data loading (code in BACKEND_INTEGRATION_COMPLETE.md)

2. **Add Wishlist Button to Products** - Add heart icon to ProductDetailScreen

3. **Filter Products by Category** - Update ProductCatalogScreen to accept categoryId param

4. **Test Full Flow** - Browse → View Details → Add to Wishlist → Check Wishlist

---

**Need help?** Check these files:
- `BACKEND_INTEGRATION_COMPLETE.md` - Detailed implementation summary
- `FIXES_APPLIED.md` - Bug fixes summary
- `SETUP_GUIDE.md` - Complete setup instructions

**Happy Testing!** 🎉
