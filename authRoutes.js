import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validation/authValidation.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
