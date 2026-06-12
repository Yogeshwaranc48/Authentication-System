import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  getProfileData,
  AppError,
} from '../services/authService.js';

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.msg || 'Validation failed';
    ApiResponse.error(res, message, 400);
    return true;
  }

  return false;
};

export const register = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const result = await registerUser(req.body);

    return ApiResponse.success(res, 'Registration successful', result, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    if (handleValidationErrors(req, res)) {
      return;
    }

    const result = await loginUser(req.body);

    return ApiResponse.success(res, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    await logoutUser(token);

    return ApiResponse.success(res, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    return ApiResponse.success(res, 'User profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getProfileData(req.user.id);

    return ApiResponse.success(res, 'Profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export { AppError };
