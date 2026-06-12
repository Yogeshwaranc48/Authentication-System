import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const blacklistedTokens = new Map();

const cleanupExpiredTokens = () => {
  const now = Date.now();

  for (const [token, expiry] of blacklistedTokens.entries()) {
    if (expiry <= now) {
      blacklistedTokens.delete(token);
    }
  }
};

setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

export const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

export const blacklistToken = (token, expiresAtMs) => {
  blacklistedTokens.set(token, expiresAtMs);
};

export const isTokenBlacklisted = (token) => {
  const expiry = blacklistedTokens.get(token);

  if (!expiry) {
    return false;
  }

  if (expiry <= Date.now()) {
    blacklistedTokens.delete(token);
    return false;
  }

  return true;
};

export const getTokenExpiryMs = (decoded) => {
  if (decoded?.exp) {
    return decoded.exp * 1000;
  }

  return Date.now() + 7 * 24 * 60 * 60 * 1000;
};
