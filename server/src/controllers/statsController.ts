import type { Response } from 'express';

import UserModel from '../models/UserModel';
import MessageModel from '../models/messageModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [usersCount, messagesCount, messageToday] = await Promise.all([
      UserModel.countDocuments({}),
      MessageModel.countDocuments({}),
      MessageModel.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

    // Read presence that socket.ts exposed as (io as any).presence
    const io = req.app.get('io') as any;
    const onlineUsers: number = io?.presence?.size ?? 0;

    return res.json({ usersCount, messagesCount, messageToday, onlineUsers });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[statsController] getStats error:', err);
    return res.status(500).json({ message: 'Failed to load stats' });
  }
};
