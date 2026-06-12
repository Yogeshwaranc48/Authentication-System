import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.msg || 'Validation failed';
    return ApiResponse.error(res, message, 400);
  }

  next();
};
