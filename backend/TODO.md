# Backend Implementation TODO

## Phase 1: Project Setup & Configuration

### Task 1: Initialize Node.js Project
- [x] Create package.json with required dependencies
- [x] Set up project structure (src, controllers, models, routes, middleware, utils)
- [x] Configure environment variables (.env file)
- [x] Set up ESLint and Prettier for code formatting
- [x] Configure nodemon for development

### Task 2: Database Setup
- [x] Install and configure PostgreSQL database
- [x] Set up database connection using Sequelize or Prisma
- [x] Create database migration files
- [x] Configure database connection pooling
- [x] Set up seed data for development

## Phase 2: Database Schema Implementation

### Task 3: Orders Table
- [x] Define orders model with all required fields
  - id (PK)
  - order_id
  - customer_name
  - phone
  - address
  - pincode
  - lat
  - lng
  - slot_date
  - slot_time
  - status
  - assigned_driver_id (FK)
  - created_at
  - updated_at
- [x] Create migration file for orders table
- [x] Implement model validation rules
- [x] Create seed data for testing

### Task 4: Drivers Table
- [x] Define drivers model with all required fields
  - id
  - name
  - phone
  - password_hash
  - current_lat
  - current_lng
- [x] Create migration file for drivers table
- [x] Implement password hashing mechanism
- [x] Add validation for phone number format

### Task 5: Customers Table
- [x] Define customers model with all required fields
  - id
  - name
  - phone
- [x] Create migration file for customers table
- [x] Implement phone number validation

## Phase 3: API Endpoints Implementation

### Task 6: Orders API
- [x] POST /api/orders/new - Receive new order from courier
  - [x] Validate incoming request body
  - [x] Store order with "Pending Slot Selection" status
  - [x] Implement error handling for duplicate orders
  - [x] Send success/failure response
- [x] GET /api/orders/:id - View order details
  - [x] Retrieve order by ID
  - [x] Handle case when order doesn't exist
  - [x] Return formatted order data
- [x] PUT /api/orders/select-slot - Customer selects delivery slot
  - [x] Validate slot selection data
  - [x] Update order with selected slot
  - [x] Change order status to "Slot Selected"
  - [x] Trigger delivery grouping logic
- [x] PUT /api/orders/update-status - Driver updates delivery status
  - [x] Validate status update request
  - [x] Update order status in database
  - [x] Notify courier system via callback
  - [x] Log status change in delivery history

### Task 7: Customers API
- [x] GET /api/customers/orders?phone= - Get customer orders by phone
  - [x] Validate phone number parameter
  - [x] Query orders associated with phone number
  - [x] Return formatted list of orders
  - [x] Handle empty result sets

### Task 8: Drivers API
- [x] POST /api/driver/login - Driver authentication
  - [x] Validate login credentials
  - [x] Implement JWT token generation
  - [x] Return driver information with token
- [x] GET /api/drivers/:id/deliveries - Get driver's assigned deliveries
  - [x] Validate driver ID
  - [x] Query deliveries assigned to driver
  - [x] Sort deliveries by optimal route
  - [x] Return formatted delivery list
- [x] PUT /api/drivers/update-location - Update driver's current location
  - [x] Validate location data
  - [x] Update driver's current coordinates
  - [x] Broadcast location to relevant parties

## Phase 4: Business Logic Implementation

### Task 9: Delivery Grouping Logic
- [x] Implement pincode-based grouping algorithm
- [x] Sort deliveries by latitude and longitude
- [x] Assign deliveries to drivers using round-robin approach
- [x] Handle edge cases (uneven distribution, driver availability)
- [x] Optimize for distance-based sorting

### Task 10: Status Management
- [x] Define all possible order statuses
- [x] Implement status transition validation
- [x] Create status change logging mechanism
- [x] Set up automatic notifications for status changes

### Task 11: Courier System Integration
- [x] Implement callback mechanism to notify courier system
- [x] Handle callback failures and retries
- [x] Log all callback attempts
- [x] Implement callback authentication

## Phase 5: Security & Middleware

### Task 12: Authentication & Authorization
- [x] Implement JWT-based authentication
- [x] Create middleware for protected routes
- [x] Implement role-based access control
- [x] Add rate limiting to prevent abuse

### Task 13: Input Validation & Sanitization
- [x] Implement request validation middleware
- [x] Sanitize user inputs to prevent injection attacks
- [x] Validate all required fields
- [x] Implement proper error messages

### Task 14: Error Handling
- [x] Create centralized error handling middleware
- [x] Define custom error classes
- [x] Implement proper HTTP status codes
- [x] Log errors for debugging

## Phase 6: Testing & Documentation

### Task 15: Unit Testing
- [ ] Write tests for all controller functions
- [ ] Test database models and validations
- [ ] Test business logic functions
- [ ] Achieve >80% code coverage

### Task 16: API Documentation
- [ ] Document all API endpoints with examples
- [ ] Create Postman collection
- [ ] Implement Swagger/OpenAPI documentation
- [ ] Document authentication flow

## Phase 7: Deployment & Monitoring

### Task 17: Production Setup
- [ ] Configure production environment variables
- [ ] Set up database connection for production
- [ ] Implement logging for production
- [ ] Configure process managers (PM2)

### Task 18: Monitoring & Analytics
- [ ] Implement request logging
- [ ] Set up error tracking
- [ ] Create basic reporting dashboard
- [ ] Implement performance monitoring

## Additional Considerations

### Task 19: SMS Integration
- [ ] Integrate with SMS provider API
- [ ] Create template for delivery slot selection message
- [ ] Implement SMS sending functionality
- [ ] Handle SMS delivery receipts

### Task 20: Map Integration
- [ ] Integrate with Google Maps API
- [ ] Calculate distances between delivery points
- [ ] Implement route optimization (basic)
- [ ] Display maps in driver app