import api from '../utils/api';
import type { User } from '../types/User';

export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get('/users');
    return res.data.users as User[];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
};
