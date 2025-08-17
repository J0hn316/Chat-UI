import { useContext } from 'react';
import { PresenceContext } from '../context/PresenceContextInstance';
import type { PresenceContextType } from '../types/PresenceContextType';

export const usePresence = (): PresenceContextType => {
  const context = useContext(PresenceContext);

  if (!context)
    throw new Error('usePresence must be used within a PresenceProvider');

  return context;
};
