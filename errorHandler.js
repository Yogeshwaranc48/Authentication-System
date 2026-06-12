import { ApiResponse } from '../utils/ApiResponse.js';
import { AppError } from '../services/authService.js';

export const notFoundHandler = (req, res) => {
  ApiResponse.error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  if (err.code === 11000) {
    return ApiResponse.error(res, 'An account with this email already exists', 409);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)[0]?.message || 'Validation failed';
    return ApiResponse.error(res, message, 400);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid resource identifier', 400);
  }

  console.error('Unhandled error:', err);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return ApiResponse.error(res, message, err.statusCode || 500);
};
