import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextInstance';
import type { AuthContextType } from '../types/AuthContextType';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
