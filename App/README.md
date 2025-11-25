# Time Slot Selection Mobile App

A comprehensive mobile application for customers and drivers to interact with an AI-Powered Delivery Slot Selection & Route Optimization System.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [App Modules](#app-modules)
- [Screens](#screens)
- [Services](#services)
- [Context Providers](#context-providers)
- [Components](#components)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Testing](#testing)

## Overview

This mobile application provides a complete solution for delivery slot selection and route optimization. It includes separate interfaces for customers and drivers with features like order creation, delivery slot selection, real-time tracking, and route optimization.

## Key Features

### Authentication
- Customer login with phone number and password
- Driver login with phone number and password
- Registration for new customers
- Password recovery

### Customer Features
- Create and manage orders
- Select delivery time slots
- Track order status
- View order history
- Manage profile

### Driver Features
- View assigned deliveries
- Real-time navigation
- Update delivery status
- Route optimization
- Performance metrics

### Common Features
- Push notifications
- In-app notification center
- Real-time location tracking
- Map visualization
- Data caching

## App Modules

### 1. Authentication Module
Handles user authentication for both customers and drivers.

### 2. Customer Module
Manages customer orders, slot selection, and tracking.

### 3. Driver Module
Manages driver deliveries, routes, and performance.

### 4. Common Features
Shared functionality between customer and driver apps.

### 5. API Integration
Handles all backend communication and data synchronization.

## Screens

### Customer Screens
- **LoginScreen**: Customer authentication
- **RegisterScreen**: New customer registration
- **OrderCreationScreen**: Create new orders
- **SlotSelectionScreen**: Select delivery time slots
- **OrderConfirmationScreen**: Confirm order details
- **OrdersScreen**: View order history
- **OrderTrackingScreen**: Track active orders
- **ProfileScreen**: Manage customer profile

### Driver Screens
- **DriverLoginScreen**: Driver authentication
- **DriverDashboardScreen**: Main dashboard with metrics
- **DeliveryManagementScreen**: Manage deliveries
- **RouteOptimizationScreen**: View optimized routes
- **DriverProfileScreen**: Manage driver profile

## Services

### API Service (`services/api.js`)
- REST API connection setup
- Authentication token management
- Request/response interceptors
- Error handling
- Customer and driver API endpoints

### Geocoding Service (`services/geocoding.js`)
- Address to coordinates conversion (geocoding)
- Coordinates to address conversion (reverse geocoding)
- Distance calculation between points
- Current location retrieval
- Location tracking

### Location Tracking Service (`services/locationTracking.js`)
- Real-time location tracking
- Location permission handling
- Location mocking for testing
- Distance calculations

### Notification Service (`services/notifications.js`)
- Push notification setup
- In-app notification management
- Delivery status alerts
- Reminder notifications
- Notification scheduling

## Context Providers

### Cache Context (`context/CacheContext.js`)
- Local data caching with TTL
- AsyncStorage integration
- Cache expiration management
- Performance optimization

### Order Context (`context/OrderContext.js`)
- Order state management
- CRUD operations for orders
- Local persistence
- Loading and error states

### Delivery Context (`context/DeliveryContext.js`)
- Delivery status tracking
- Delivery state management
- Local persistence
- Loading and error states

## Components

### MapComponent (`components/MapComponent.js`)
- Interactive map display
- Location markers
- Route visualization
- Real-time location updates

### NotificationCenter (`components/NotificationCenter.js`)
- In-app notification display
- Notification management
- Read/unread status tracking

### NotificationButton (`components/NotificationButton.js`)
- Notification indicator in headers
- Unread count display

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development framework and tools
- **React Navigation**: Navigation between screens
- **Axios**: HTTP client for API requests
- **AsyncStorage**: Local data storage
- **React Native Maps**: Map visualization
- **Expo Location**: Geolocation services
- **Expo Notifications**: Push notifications
- **React Context API**: State management
- **Jest**: Testing framework

## Installation

1. Clone the repository
2. Navigate to the App directory:
   ```bash
   cd App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```

## Testing

The app includes unit tests for core functionality:

- Mathematical utility functions
- Performance testing for critical operations
- Cache system operations

To run tests:
```bash
npm test
```

Tests cover:
- Distance calculation accuracy
- Number formatting functions
- Cache operations (add, retrieve, remove, clear)
- Performance benchmarks