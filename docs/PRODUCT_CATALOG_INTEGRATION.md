# Product Catalog Integration Documentation

## Overview
This document describes the implementation of the Product Catalog Integration (Phase 2) in the TimeDrop customer app. The integration connects the ProductCatalogScreen.js to fetch dynamic products from the backend API instead of using static data.

## Features Implemented

### 1. Dynamic Product Loading
- Fetches products from the backend API using `apiService.products.getProducts()`
- Implements proper loading states with ActivityIndicator
- Handles initial loading, refreshing, and pagination loading

### 2. Pull-to-Refresh Functionality
- Implemented using React Native's RefreshControl
- Triggers complete data refresh when pulled down
- Shows loading indicator during refresh

### 3. Infinite Scrolling with Pagination
- Loads products in batches of 12 per page
- Automatically fetches more products when scrolling near bottom
- Tracks whether more products are available to load
- Shows loading indicator when fetching more products

### 4. Search Functionality
- Real-time search with debounced API calls (500ms delay)
- Filters products based on search query
- Clear search functionality

### 5. Filtering and Sorting
- Category filtering capability
- Sorting options (by default: createdAt DESC)
- Combined search and filter functionality

### 6. Error Handling
- Network error detection and display
- Server error handling
- User-friendly error messages
- Graceful degradation when API is unavailable

### 7. Favorites/Wishlist
- Client-side favorite tracking using React state
- Visual indicators for favorite status
- Persistent favorite status during session

## API Integration

### Endpoints Used
- `GET /api/products` - Fetch products with pagination, search, and filters

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search query string
- `category` - Category filter
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order (ASC/DESC, default: DESC)

### Response Format Expected
```json
{
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "price": "29.99",
        "image": "https://example.com/image.jpg",
        "category": "Electronics"
      }
    ],
    "total": 100
  }
}
```

## Components and Functions

### State Variables
- `products` - Array of fetched products
- `loading` - Boolean for initial loading state
- `refreshing` - Boolean for pull-to-refresh state
- `error` - Error message string
- `page` - Current page number
- `hasMore` - Boolean indicating if more products exist
- `isLoadingMore` - Boolean for loading more state
- `searchQuery` - Current search query
- `selectedCategory` - Selected category filter
- `sortBy` - Current sort field
- `sortOrder` - Current sort order
- `favorites` - Set of favorited product IDs

### Key Functions
- `loadProducts()` - Main function to fetch products from API
- `onRefresh()` - Handles pull-to-refresh
- `loadMoreProducts()` - Handles infinite scrolling
- `handleSearchChange()` - Handles search with debounce
- `clearSearch()` - Clears search and resets to page 1
- `applyFilters()` - Applies category/sort filters
- `clearFilters()` - Resets all filters

## Performance Optimizations
- Debounced search to prevent excessive API calls
- Efficient rendering with FlatList-like virtualization
- Client-side favorite tracking to avoid API calls
- Conditional rendering of loading indicators

## Error Handling
- Network error detection
- Server error response handling
- Fallback error messages
- Graceful degradation when API is unavailable

## Future Enhancements
- Backend integration for actual favorite/wishlist functionality
- Advanced filtering options
- Improved offline support
- Image caching for better performance

## Testing
- Unit tests for API integration
- Component rendering tests
- Error handling tests
- Loading state verification

## Dependencies
- `apiService` from `../services/api.js`
- React Native components
- AsyncStorage for persistent favorites (future enhancement)

## Troubleshooting
- If products don't load, verify backend API is running
- Check network connectivity
- Verify API response format matches expected structure
- Review error messages for specific failure details