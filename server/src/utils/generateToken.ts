import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { JWT_SECRET_TYPED } from './config';

/**
 * Generates a JWT token with userId payload.
 * @param userId - Mongoose ObjectId or string
 * @returns A signed JWT token
 */

// 🔐 Helper: Generate JWT token
export default function generateToken(userId: string | Types.ObjectId): string {
  return jwt.sign({ id: userId }, JWT_SECRET_TYPED, { expiresIn: '7d' });
}
