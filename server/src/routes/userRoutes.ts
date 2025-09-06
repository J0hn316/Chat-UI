import { Router } from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import { registerUser, loginUser } from '../controllers/authController';
import { getCurrentUser, getAllUsers } from '../controllers/userController';

const router = Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', registerUser);

// 🔐 Protected route to get current user
router.get('/me', authMiddleware, getCurrentUser);

// 🔐 Protected route to get all users
router.get('/', authMiddleware, getAllUsers);

export default router;
