import { useEffect, useState } from 'react';
import type { ReactNode, JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../utils/api';
import type { User } from '../types/User';
import { AuthContext } from './AuthContextInstance';
import { joinUserRoom, socket } from '../utils/socket';

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // ⏱️ Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await api.get('/users/me');
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

  useEffect(() => {
    if (user?._id) joinUserRoom(user._id);

    socket.on('connect_error', (err) =>
      console.error('Socket connect_error:', err.message)
    );
  }, [user?._id]);

  // 🔄 Fetch current user when token exists
  // useEffect(() => {
  //   const fetchUser = async (): Promise<void> => {
  //     if (!token) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const res = await api.get('/users/me');
  //       setUser(res.data.user);
  //     } catch (err) {
  //       console.error('Failed to fetch user:', err);
  //       setUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchUser();
  // }, [token]);

  // 🔑 Login function to set token and user
  const login = async (newToken: string): Promise<void> => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoading(true);
    navigate('/dashboard');
  };

  // 🚪 Logout function to clear token and user
  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
