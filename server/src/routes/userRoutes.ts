import express from 'express';
import { getCurrentUser } from '../controllers/userController';
import { registerUser, loginUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔐 Protected route to get current user
router.get('/me', authMiddleware, getCurrentUser);

export default router;
