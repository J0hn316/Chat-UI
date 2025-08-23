import { Response } from 'express';

import UserModel from '../models/UserModel';
import MessageModel from '../models/messageModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    // Run in parallel for speed
    const [usersCount, messagesCount, messageToday] = await Promise.all([
      UserModel.countDocuments({}),
      MessageModel.countDocuments({}),
      MessageModel.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

    return res.json({ usersCount, messagesCount, messageToday });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[statsController] getStats error:', err);
    return res.status(500).json({ message: 'Failed to load stats' });
  }
};
