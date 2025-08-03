import { Response } from 'express';
import UserModel from '../models/User';
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
  const userId = req.userId;

  try {
    const users = await UserModel.find({ _id: { $ne: userId } }).select(
      '_id username email createdAt'
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
