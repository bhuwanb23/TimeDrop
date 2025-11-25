/**
 * Custom error classes
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message || 'Validation failed', 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message || 'Authentication failed', 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message || 'Access denied', 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource not found', 404);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message || 'Resource already exists', 409);
  }
}

class RateLimitError extends AppError {
  constructor(message) {
    super(message || 'Too many requests', 429);
  }
}

/**
 * Centralized error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Global error handler:', err);
  
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  // Send error response
  if (process.env.NODE_ENV === 'development') {
    // Detailed error response for development
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Simplified error response for production
    // Only send operational errors, not programming errors
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

/**
 * Handle async errors
 * Wraps async route handlers to catch unhandled promise rejections
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  globalErrorHandler,
  catchAsync
};