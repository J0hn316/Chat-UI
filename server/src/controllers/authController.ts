import { Request, Response } from 'express';

import UserModel, { UserDocument } from '../models/UserModel';
import generateToken from '../utils/generateToken';

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user: UserDocument = new UserModel({
      username,
      email,
      password,
      passwordConfirmation: password,
    });
    const savedUser = await user.save();

    const token = generateToken(savedUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login an existing user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await UserModel.findOne({ email });
    const isMatch = await user?.comparePassword(password!);

    if (!user || !isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const typedUser = user as UserDocument;
    const token = generateToken(typedUser._id);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        _id: typedUser._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
