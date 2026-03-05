# ✅ Backend API Endpoints - COMPLETE

This document lists all completed backend API endpoints for the TimeDrop application.

## 📁 Category Routes (`/api/categories`)

**File:** `backend/src/routes/categories.js`  
**Status:** ✅ COMPLETE

### Public Endpoints (No Authentication Required)

```javascript
GET /api/categories
```
- **Description:** List all categories with pagination
- **Query Parameters:**
  - `page` (default: 1) - Page number
  - `limit` (default: 10) - Items per page
  - `status` (default: 'active') - Filter by status
  - `sortBy` (default: 'sort_order') - Sort field
  - `sortOrder` (default: 'ASC') - Sort order
- **Response:** Array of categories with product count
- **Example:** `/api/categories?page=1&limit=20&status=active`

```javascript
GET /api/categories/:id
```
- **Description:** Get single category by ID with its active products
- **Parameters:** `id` - Category ID
- **Response:** Single category object with products array
- **Example:** `/api/categories/1`

```javascript
GET /api/categories/:id/products
```
- **Description:** Get all products in a specific category
- **Parameters:** `id` - Category ID
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `sortBy` (default: 'createdAt')
  - `sortOrder` (default: 'DESC')
- **Response:** Products array with category info and pagination
- **Example:** `/api/categories/1/products?page=1&limit=10`

### Protected Endpoints (Admin Only)

```javascript
POST /api/categories
```
- **Authentication:** Required (Admin role)
- **Description:** Create a new category
- **Body:**
  ```json
  {
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "image_url": "https://...",
    "parent_category_id": null,
    "sort_order": 0
  }
  ```

```javascript
PUT /api/categories/:id
```
- **Authentication:** Required (Admin role)
- **Description:** Update an existing category
- **Parameters:** `id` - Category ID
- **Body:** Fields to update (name, description, image_url, etc.)

```javascript
DELETE /api/categories/:id
```
- **Authentication:** Required (Admin role)
- **Description:** Soft delete a category (sets status to 'inactive')
- **Parameters:** `id` - Category ID

---

## 👥 User Routes (`/api/users`)

**File:** `backend/src/routes/users.js`  
**Status:** ✅ COMPLETE

### Authenticated User Endpoints

```javascript
GET /api/users/profile
```
- **Authentication:** Required (Any role)
- **Description:** Get current authenticated user's profile
- **Response:** User object (without password)
- **Example:** Returns profile of logged-in user

```javascript
PUT /api/users/profile
```
- **Authentication:** Required (Any role)
- **Description:** Update current user's own profile
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "+1234567890",
    "profile_image": "https://..."
  }
  ```
- **Note:** Email can be updated but must be unique

### Admin-Only Endpoints

```javascript
GET /api/users/drivers
```
- **Authentication:** Required (Admin role only)
- **Description:** List all drivers with pagination
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (optional) - Filter by status
  - `sortBy` (default: 'createdAt')
  - `sortOrder` (default: 'ASC')
- **Response:** Array of driver users with pagination

```javascript
GET /api/users/customers
```
- **Authentication:** Required (Admin role only)
- **Description:** List all customers with pagination
- **Query Parameters:** Same as GET /drivers
- **Response:** Array of customer users with pagination

```javascript
GET /api/users
```
- **Authentication:** Required (Admin role only)
- **Description:** List ALL users (any role) with pagination
- **Query Parameters:**
  - `page`, `limit`, `role`, `status`, `sortBy`, `sortOrder`
- **Response:** All users with pagination

```javascript
GET /api/users/:id
```
- **Authentication:** Required (Admin role only)
- **Description:** Get specific user by ID
- **Parameters:** `id` - User ID

```javascript
PUT /api/users/:id
```
- **Authentication:** Required (Admin role only)
- **Description:** Update any user's profile (admin)
- **Parameters:** `id` - User ID
- **Body:** All user fields can be updated

```javascript
DELETE /api/users/:id
```
- **Authentication:** Required (Admin role only)
- **Description:** Soft delete user (sets status to 'inactive')
- **Parameters:** `id` - User ID

---

## 📦 Other Complete Route Files

### Products (`/api/products`)
✅ File: `backend/src/routes/products.js`
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Orders (`/api/orders`)
✅ File: `backend/src/routes/orders.js`
- Full CRUD operations for orders
- Order items management
- Status tracking

### Deliveries (`/api/deliveries`)
✅ File: `backend/src/routes/deliveries.js`
- GET `/api/deliveries/statistics` - Driver statistics
- GET `/api/deliveries` - List deliveries (with filters)
- GET `/api/deliveries/:id` - Get delivery by ID
- POST `/api/deliveries/assign` - Assign delivery to driver
- PUT `/api/deliveries/:id/status` - Update delivery status

### Wishlist (`/api/wishlist`)
✅ File: `backend/src/routes/wishlist.js`
- GET `/api/wishlist` - Get user's wishlist
- POST `/api/wishlist` - Add item to wishlist
- DELETE `/api/wishlist/:id` - Remove from wishlist
- DELETE `/api/wishlist/clear` - Clear entire wishlist

### Auth (`/api/auth`)
✅ File: `backend/src/routes/auth.js`
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout

### Routes (`/api/routes`)
✅ File: `backend/src/routes/routes.js`
- Route optimization endpoints
- Navigation data

### WhatsApp Webhooks (`/api/webhooks`)
✅ File: `backend/src/routes/whatsapp.js`
- WhatsApp messaging integration

---

## 🔧 Middleware Used

### Authentication Middleware
```javascript
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
```

**Usage:**
```javascript
// Protect route
router.get('/protected', authenticateToken, controller);

// Protect with role check
router.post('/admin-only', authenticateToken, authorizeRoles('admin'), controller);
```

---

## 📊 Database Models

All routes work with these Sequelize models:
- ✅ User
- ✅ Product
- ✅ Category
- ✅ Order
- ✅ OrderItem
- ✅ Delivery
- ✅ Address
- ✅ Wishlist

---

## 🎯 Testing the Endpoints

### Using cURL or Postman:

```bash
# Get all categories
curl http://localhost:3000/api/categories

# Get category by ID
curl http://localhost:3000/api/categories/1

# Get products in category
curl http://localhost:3000/api/categories/1/products

# Get all drivers (admin only)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/users/drivers

# Get your profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/users/profile

# Update your profile
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","phone":"1234567890"}' \
  http://localhost:3000/api/users/profile
```

### Using the Frontend App:

The frontend already consumes these endpoints through:
- `App/services/api.js` - API service layer
- `App/screens/CategoryScreen.js` - Uses category endpoints
- `App/screens/CustomerProfileScreen.js` - Uses user profile endpoints

---

## ✅ Summary

### Completed Features:
- ✅ Category CRUD operations with product filtering
- ✅ User profile management (get/update own profile)
- ✅ Admin user management (list drivers/customers, CRUD)
- ✅ Pagination on all list endpoints
- ✅ Role-based access control
- ✅ Soft delete for data preservation
- ✅ Password exclusion from responses
- ✅ Comprehensive error handling

### Total Endpoints:
- **Categories:** 6 endpoints (3 public, 3 admin)
- **Users:** 7 endpoints (2 authenticated, 5 admin)
- **Total New:** 13 fully functional endpoints

All endpoints are production-ready with proper authentication, validation, and error handling! 🚀
