import crypto from 'crypto';
import type { Request, Response } from 'express';

import UserModel from '../models/UserModel';
import { sendPasswordResetEmail } from '../utils/mailer';

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL ?? 'http://localhost:5173';

export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    const { email } = req.body as { email?: string };
    if (!email) return res.status(400).json({ message: 'Email is required' });

    //Find User
    const user = await UserModel.findOne({ email }).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (user) {
      // Create token and save
      const { rawToken } = user.createPasswordRestToken();
      await user.save({ validateBeforeSave: false });

      const resetUrl = `${CLIENT_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(
        email
      )}`;

      // Send email (non-blocking failures should be logged but not leak)
      try {
        await sendPasswordResetEmail(email, resetUrl);
      } catch (error) {
        // If email fails, clear token so it can't be dangling
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save({ validateBeforeSave: false });
        throw error;
      }
      // Always respond success to prevent email enumeration
      res.json({
        message: 'If that email exists, a reset link has been sent.',
      });
    }
  } catch (error) {
    console.error('[requestPasswordReset] error', error);
    return res.status(500).json({ message: 'Unable to process request.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password, confirmPassword } = req.body as {
      token?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!token || !email)
      return res.status(400).json({ message: 'Invalid reset link.' });

    if (!password || !confirmPassword)
      return res.status(400).json({ message: 'Password is required.' });

    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters.' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires +password');

    if (!user)
      return res
        .status(400)
        .json({ message: 'Reset link is invalid or expired.' });

    // Set new password (pre-save hook will hash it and set passwordChangedAt)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.save();

    return res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('[resetPassword] error', error);
    return res.status(500).json({ message: 'Unable to reset password.' });
  }
};
