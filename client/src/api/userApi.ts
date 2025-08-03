import api from '../utils/api';
import type { User } from '../types/User';

export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get('/users');
    return res.data.users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}
