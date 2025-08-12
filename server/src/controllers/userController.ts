import { Response } from 'express';

import UserModel from '../models/UserModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// ✅ Get current logged-in user
export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get all users
export async function getAllUsers(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const currentUserId = req.userId;

  try {
    // Fetch everyone except the current user
    const users = await UserModel.find(
      currentUserId ? { _id: { $ne: currentUserId } } : {}
    )
      .select('_id username email createdAt lastSeen')
      .lean();

    // Read presence map from Socket.IO (set in setupSocket)
    const io = req.app.get('io') as
      | {
          presence?: Map<
            string,
            { sockets: Set<string>; lastSeen?: Date | null }
          >;
        }
      | undefined;

    const presence =
      io?.presence ??
      new Map<string, { sockets: Set<string>; lastSeen?: Date | null }>();

    const enriched = users.map((u) => {
      const entry = presence.get(String(u._id));
      const isOnline = !!entry && entry.sockets.size > 0;
      const lastSeen = isOnline ? null : u.lastSeen ?? entry?.lastSeen ?? null;

      return {
        ...u,
        isOnline,
        lastSeen: lastSeen ? new Date(lastSeen).toISOString() : null,
      };
    });

    res.status(200).json({ users: enriched });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
