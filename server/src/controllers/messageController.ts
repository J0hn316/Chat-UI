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
    const created = await Message.create({
      sender: userId,
      recipient: recipientId,
      content,
    });

    const message = await Message.findById(created.id)
      .populate('sender', 'username')
      .populate('recipient', 'username')
      .exec();

    if (!message) {
      res.status(500).json({ message: 'Failed to build message.' });
      return;
    }

    // Respond to sender immediately (so their UI updates)
    res.status(201).json({ message });

    // Emit to the recipient’s room so it appears in real time
    const io = req.app.get('io');

    if (io) {
      io.to(String(recipientId)).emit('message:new', message);
    } else {
      console.error('Socket.IO instance not found on app.');
    }
  } catch (err) {
    console.error('Send message error:', err);
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
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username')
      .populate('recipient', 'username');

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to retrieve messages' });
  }
};
