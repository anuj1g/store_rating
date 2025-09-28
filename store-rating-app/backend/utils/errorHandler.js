/**
 * Custom error handler class that extends the built-in Error class
 */
class ErrorHandler extends Error {
  /**
   * Create a new ErrorHandler instance
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} [errors] - Additional error details
   */
  constructor(statusCode, message, errors = null) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

/**
 * Error handling middleware for Express
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleError = (err, req, res, next) => {
  // Default status code and message
  let { statusCode = 500, message } = err;
  let errors = err.errors || null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = [];
    
    // Format validation errors
    for (const field in err.errors) {
      if (err.errors[field]) {
        validationErrors.push({
          field,
          message: err.errors[field].message || 'Validation error',
          type: err.errors[field].kind || 'Validation'
        });
      }
    }
    
    errors = validationErrors;
    message = 'Validation failed';
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication failed';
    errors = [{
      message: err.message,
      type: err.name
    }];
  }
  
  // Handle duplicate key errors (MongoDB)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    errors = [{
      field,
      message: `The ${field} '${err.keyValue[field]}' is already in use`,
      type: 'DuplicateKeyError'
    }];
  }

  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`, {
    error: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Async error handler wrapper for Express routes
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler with error handling
 */
const asyncHandler = (fn) => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  ErrorHandler,
  handleError,
  asyncHandler,
  notFoundHandler
};
