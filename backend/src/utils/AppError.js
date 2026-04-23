// src/utils/AppError.js
// Custom error class to attach HTTP status codes to thrown errors.
// Usage: throw new AppError('Not found', 404);

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // vs programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
