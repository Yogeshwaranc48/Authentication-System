import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const rateLimitHandler = (_req, res) => {
  ApiResponse.error(res, 'Too many requests, please try again later', 429);
};

export const generalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const authLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.authRateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
});
