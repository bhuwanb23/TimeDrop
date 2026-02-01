# API Service Guide

## Overview
The API service provides a centralized way to communicate with the backend API for the TimeDrop delivery application. It handles authentication, request/response interception, and provides organized access to different API endpoints.

## Installation
The API service requires the following dependency:
```bash
npx expo install @react-native-async-storage/async-storage
```

## Configuration
The service is configured with:
- Base URL: `http://10.0.2.2:3000/api` (for Android emulator) in development
- Timeout: 10 seconds
- Default headers: `Content-Type: application/json`

For iOS simulator, the service will automatically use `http://localhost:3000/api` in development. The service uses conditional logic based on `__DEV__` to determine the appropriate URL.

## API Methods

### Authentication API (`apiService.auth`)
- `login(credentials)` - Authenticate user with email/password
- `register(userData)` - Register new user
- `getProfile()` - Get current user profile
- `updateProfile(profileData)` - Update user profile
- `logout()` - Log out user

### Product API (`apiService.products`)
- `getProducts(params)` - Get list of products with optional filters
- `getProductById(id)` - Get specific product by ID

### Order API (`apiService.orders`)
- `getOrders(params)` - Get list of orders for current user
- `getOrderById(id)` - Get specific order by ID
- `createOrder(orderData)` - Create a new order
- `updateOrderStatus(id, status)` - Update order status (admin/driver only)

## Usage Examples

### Authentication
```javascript
import apiService from '../services/api';

// Login
try {
  const response = await apiService.auth.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  // Save token to storage
  await apiService.setAuthToken(response.data.token);
} catch (error) {
  console.error('Login failed:', error.response?.data?.error || error.message);
}
```

### Fetching Products
```javascript
// Get all products
try {
  const response = await apiService.products.getProducts();
  console.log(response.data);
} catch (error) {
  console.error('Error fetching products:', error);
}

// Get products with filters
try {
  const response = await apiService.products.getProducts({
    category: 'electronics',
    page: 1,
    limit: 10
  });
  console.log(response.data);
} catch (error) {
  console.error('Error fetching filtered products:', error);
}

// Get specific product
try {
  const response = await apiService.products.getProductById(productId);
  console.log(response.data);
} catch (error) {
  console.error('Error fetching product:', error);
}
```

### Creating Orders
```javascript
try {
  const orderData = {
    items: [
      { product_id: 1, quantity: 2, notes: 'Handle with care' },
      { product_id: 3, quantity: 1 }
    ],
    delivery_address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      zip_code: '12345',
      country: 'USA'
    },
    delivery_notes: 'Leave at front door',
    payment_method: 'cash_on_delivery',
    delivery_time: '2023-12-25T14:00:00Z'
  };
  
  const response = await apiService.orders.createOrder(orderData);
  console.log('Order created:', response.data);
} catch (error) {
  console.error('Error creating order:', error.response?.data?.error || error.message);
}
```

## Token Management
The service automatically handles JWT token storage and retrieval using AsyncStorage:

```javascript
// Set token after login
await apiService.setAuthToken(jwtToken);

// Get current token
const token = await apiService.getAuthToken();

// Clear token on logout
await apiService.setAuthToken(null);
```

## Error Handling
The service includes automatic error handling:
- 401 Unauthorized responses automatically clear the stored token
- Errors are propagated to the calling function for custom handling
- Network timeouts and connection errors are handled gracefully

## Interceptors
- **Request Interceptor**: Adds Authorization header with JWT token for authenticated requests
- **Response Interceptor**: Handles authentication errors and redirects appropriately

## Development Notes
- The Android emulator uses `10.0.2.2` to access localhost on the host machine
- For production, update the API_BASE_URL to point to your production backend
- Ensure the backend server is running before attempting API calls