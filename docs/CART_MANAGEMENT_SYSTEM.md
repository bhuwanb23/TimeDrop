# Cart Management System Documentation

## Overview
This document describes the implementation of the Cart Management System (Phase 3) in the TimeDrop customer app. The system provides persistent cart functionality that syncs with the backend and manages shopping cart state across app sessions.

## Features Implemented

### 1. Global Cart State Management
- Implemented using React Context API and useReducer hook
- Centralized cart state with items, totals, and loading/error states
- Actions for all cart operations (add, remove, update quantity, clear)

### 2. Cart Persistence
- Local persistence using AsyncStorage
- Cart data preserved across app restarts
- Automatic save/load functionality

### 3. Dynamic Cart Operations
- Add items to cart with quantity validation
- Remove items from cart
- Update item quantities
- Clear entire cart
- Real-time calculation of cart totals

### 4. Backend Integration
- Framework for syncing cart with backend when user is authenticated
- Error handling for network issues
- Potential future sync capability

### 5. Stock Validation
- Validates product stock availability before adding to cart
- Prevents adding more items than available stock
- Provides user feedback for validation errors

### 6. UI Integration
- Cart badge on bottom tab navigator shows item count
- Cart screen displays items with quantity controls
- Product catalog screen integrates add-to-cart functionality

## Components and Files

### Core Components
- `App/context/CartContext.js` - Cart state management and provider
- `App/screens/CartScreen.js` - Cart display and management UI
- `App/screens/ProductCatalogScreen.js` - Integration with add-to-cart functionality
- `App/App.js` - Wraps app with CartProvider and integrates cart count in tabs

### Key Functions
- `addItem(product, quantity)` - Add product to cart with validation
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear entire cart
- `getCartTotal()` - Calculate total cart value
- `getCartItemCount()` - Get total number of items
- `syncCartWithBackend()` - Sync cart with backend when authenticated

## State Structure
```javascript
{
  items: [
    {
      productId: String,
      product: Object,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      size: String,
      color: String
    }
  ],
  totalItems: Number,
  totalAmount: Number,
  loading: Boolean,
  error: String
}
```

## Usage in Components

### Using Cart Context
```javascript
import { useCart } from '../context/CartContext';

const MyComponent = () => {
  const { items, totalItems, totalAmount, addItem, removeItem, updateQuantity } = useCart();
  
  // Use cart functions and state
};
```

### Adding to Cart
```javascript
const handleAddToCart = async (product) => {
  try {
    await addItem(product, 1); // Add 1 quantity
    Alert.alert('Success', `${product.name} added to cart!`);
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

## API Integration
The system is designed to sync with backend cart endpoints when the user is authenticated:
- Checks for authentication token
- Would sync cart items with backend (implementation-ready)
- Falls back to local storage when not authenticated

## Error Handling
- Network error detection during backend sync
- Stock availability validation
- User-friendly error messages
- Graceful degradation when backend is unavailable

## Performance Considerations
- Efficient state updates using useReducer
- Debounced operations to prevent excessive renders
- AsyncStorage for fast local persistence
- Optimized cart calculations

## Future Enhancements
- Complete backend cart endpoint integration
- Wishlist functionality
- Coupon/promotion code support
- Cross-device cart sync
- Guest cart merging upon login

## Testing Considerations
- Cart operations (add, remove, update quantity)
- Persistence across app restarts
- Stock validation
- Error handling scenarios
- UI integration

## Dependencies
- React Context API
- useReducer hook
- AsyncStorage for persistence
- React Native Alert for user feedback

## Troubleshooting
- If cart doesn't persist, check AsyncStorage permissions
- If backend sync fails, verify authentication token
- If calculations are incorrect, check price/quantity data types
- If UI doesn't update, ensure components are wrapped with CartProvider

## Security Considerations
- Cart data is stored locally using AsyncStorage
- Backend sync only occurs when user is authenticated
- Stock validation happens client-side but should be verified server-side