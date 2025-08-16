import express from 'express';

import { authMiddleware } from '../middleware/authMiddleware';
import {
  sendMessage,
  getMessagesWithUser,
  markedReadMessages,
  toggleReaction,
} from '../controllers/messageController';

const router = express.Router();

// 🔒 All routes below require authentication
router.use(authMiddleware);

// POST /api/messages — send a new message
router.post('/', sendMessage);

// GET /api/messages/:userId — get messages with a specific user
router.get('/:userId', getMessagesWithUser);

router.post('/mark-read', markedReadMessages);

// toggle reaction
router.post('/:id/reactions', toggleReaction);

export default router;
