import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { getCurrentUser } from '../controllers/userController';
import { registerUser, loginUser } from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔐 Protected route to get current user
router.get('/me', authMiddleware, getCurrentUser);

export default router;
