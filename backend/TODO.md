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
- [ ] Define orders model with all required fields
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
- [ ] Create migration file for orders table
- [ ] Implement model validation rules
- [ ] Create seed data for testing

### Task 4: Drivers Table
- [ ] Define drivers model with all required fields
  - id
  - name
  - phone
  - password_hash
  - current_lat
  - current_lng
- [ ] Create migration file for drivers table
- [ ] Implement password hashing mechanism
- [ ] Add validation for phone number format

### Task 5: Customers Table
- [ ] Define customers model with all required fields
  - id
  - name
  - phone
- [ ] Create migration file for customers table
- [ ] Implement phone number validation

## Phase 3: API Endpoints Implementation

### Task 6: Orders API
- [ ] POST /api/orders/new - Receive new order from courier
  - [ ] Validate incoming request body
  - [ ] Store order with "Pending Slot Selection" status
  - [ ] Implement error handling for duplicate orders
  - [ ] Send success/failure response
- [ ] GET /api/orders/:id - View order details
  - [ ] Retrieve order by ID
  - [ ] Handle case when order doesn't exist
  - [ ] Return formatted order data
- [ ] PUT /api/orders/select-slot - Customer selects delivery slot
  - [ ] Validate slot selection data
  - [ ] Update order with selected slot
  - [ ] Change order status to "Slot Selected"
  - [ ] Trigger delivery grouping logic
- [ ] PUT /api/orders/update-status - Driver updates delivery status
  - [ ] Validate status update request
  - [ ] Update order status in database
  - [ ] Notify courier system via callback
  - [ ] Log status change in delivery history

### Task 7: Customers API
- [ ] GET /api/customers/orders?phone= - Get customer orders by phone
  - [ ] Validate phone number parameter
  - [ ] Query orders associated with phone number
  - [ ] Return formatted list of orders
  - [ ] Handle empty result sets

### Task 8: Drivers API
- [ ] POST /api/driver/login - Driver authentication
  - [ ] Validate login credentials
  - [ ] Implement JWT token generation
  - [ ] Return driver information with token
- [ ] GET /api/drivers/:id/deliveries - Get driver's assigned deliveries
  - [ ] Validate driver ID
  - [ ] Query deliveries assigned to driver
  - [ ] Sort deliveries by optimal route
  - [ ] Return formatted delivery list
- [ ] PUT /api/drivers/update-location - Update driver's current location
  - [ ] Validate location data
  - [ ] Update driver's current coordinates
  - [ ] Broadcast location to relevant parties

## Phase 4: Business Logic Implementation

### Task 9: Delivery Grouping Logic
- [ ] Implement pincode-based grouping algorithm
- [ ] Sort deliveries by latitude and longitude
- [ ] Assign deliveries to drivers using round-robin approach
- [ ] Handle edge cases (uneven distribution, driver availability)
- [ ] Optimize for distance-based sorting

### Task 10: Status Management
- [ ] Define all possible order statuses
- [ ] Implement status transition validation
- [ ] Create status change logging mechanism
- [ ] Set up automatic notifications for status changes

### Task 11: Courier System Integration
- [ ] Implement callback mechanism to notify courier system
- [ ] Handle callback failures and retries
- [ ] Log all callback attempts
- [ ] Implement callback authentication

## Phase 5: Security & Middleware

### Task 12: Authentication & Authorization
- [ ] Implement JWT-based authentication
- [ ] Create middleware for protected routes
- [ ] Implement role-based access control
- [ ] Add rate limiting to prevent abuse

### Task 13: Input Validation & Sanitization
- [ ] Implement request validation middleware
- [ ] Sanitize user inputs to prevent injection attacks
- [ ] Validate all required fields
- [ ] Implement proper error messages

### Task 14: Error Handling
- [ ] Create centralized error handling middleware
- [ ] Define custom error classes
- [ ] Implement proper HTTP status codes
- [ ] Log errors for debugging

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