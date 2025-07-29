import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

/**
 * Generates a JWT token with userId payload.
 * @param userId - Mongoose ObjectId or string
 * @returns A signed JWT token
 */

const JWT_SECRET = process.env.JWT_SECRET || '';

// 🔐 Helper: Generate JWT token
export default function generateToken(userId: string | Types.ObjectId): string {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}
