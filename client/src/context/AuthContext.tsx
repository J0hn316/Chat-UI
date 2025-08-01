import { useEffect, useState } from 'react';
import type { ReactNode, JSX } from 'react';

import api from '../utils/api';
import type { User } from '../types/User';
import { AuthContext } from './AuthContextInstance';

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 🔄 Fetch current user when token exists
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // 🔑 Login function to set token and user
  const login = async (newToken: string): Promise<void> => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // 🚪 Logout function to clear token and user
  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
