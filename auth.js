import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { isTokenBlacklisted } from '../utils/token.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Authentication required', 401);
    }

    const token = authHeader.slice(7);

    if (isTokenBlacklisted(token)) {
      return ApiResponse.error(res, 'Token has been revoked', 401);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return ApiResponse.error(res, 'Token has expired', 401);
      }

      return ApiResponse.error(res, 'Invalid token', 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return ApiResponse.error(res, 'User not found', 401);
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role || 'user',
    };

    req.token = token;

    next();
  } catch {
    return ApiResponse.error(res, 'Authentication failed', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, 'Authentication required', 401);
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};
