import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import {
  sendMessage,
  getMessagesWithUser,
} from '../controllers/messageController';

const router = express.Router();

// 🔒 All routes below require authentication
router.use(authMiddleware);

// POST /api/messages — send a new message
router.post('/', sendMessage);

// GET /api/messages/:userId — get messages with a specific user
router.get('/:userId', getMessagesWithUser);

export default router;
