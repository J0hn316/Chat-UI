import { Response } from 'express';

import Message from '../models/messageModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// Send a message
export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { content, recipientId } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!content || !recipientId) {
    res.status(400).json({ error: 'Content and recipient are required' });
    return;
  }

  try {
    const message = await Message.create({
      sender: userId,
      recipient: recipientId,
      content,
    });
    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get all messages between current user and another user
export const getMessagesWithUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { userId: otherUserId } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
};
