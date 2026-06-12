import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import {
  generateToken,
  blacklistToken,
  verifyToken,
  getTokenExpiryMs,
} from '../utils/token.js';
import { sanitizeUserInput, sanitizeLoginInput, normalizeEmail } from '../utils/sanitize.js';
import { validateSanitizedEmail } from '../validation/authValidation.js';

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const toPublicUser = (user) => {
  const userObject = user.toJSON ? user.toJSON() : user;
  return userObject;
};

export const registerUser = async (rawInput) => {
  const { username, email, password, confirmPassword } = sanitizeUserInput(rawInput);

  if (!username || !email || !password || !confirmPassword) {
    throw new AppError('All fields are required', 400);
  }

  if (!validateSanitizedEmail(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 400);
  }

  const existingUser = await User.findOne({ email: normalizeEmail(email) });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await User.create({
    username,
    email: normalizeEmail(email),
    passwordHash,
  });

  const token = generateToken(user._id.toString());

  return {
    user: toPublicUser(user),
    token,
  };
};

export const loginUser = async (rawInput) => {
  const { email, password } = sanitizeLoginInput(rawInput);

  if (!email || !password) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!validateSanitizedEmail(email)) {
    throw new AppError('Invalid credentials', 401);
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id.toString());

  return {
    user: toPublicUser(user),
    token,
  };
};

export const logoutUser = async (token) => {
  if (!token) {
    throw new AppError('Authentication token is required', 401);
  }

  try {
    const decoded = verifyToken(token);
    blacklistToken(token, getTokenExpiryMs(decoded));
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toPublicUser(user);
};

export const getProfileData = async (userId) => {
  const user = await getUserById(userId);

  return {
    ...user,
    profile: {
      memberSince: user.createdAt,
      lastUpdated: user.updatedAt,
    },
  };
};
