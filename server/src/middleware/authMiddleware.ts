import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET_TYPED } from '../utils/config';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_TYPED) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
