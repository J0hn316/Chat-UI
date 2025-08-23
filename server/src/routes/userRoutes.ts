import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { getCurrentUser, getAllUsers } from '../controllers/userController';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🔐 Protected route to get current user
router.get('/me', authMiddleware, getCurrentUser);

// 🔐 Protected route to get all users
router.get('/', authMiddleware, getAllUsers);

export default router;
