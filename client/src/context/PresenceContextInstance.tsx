import { createContext } from 'react';
import type { PresenceContextType } from '../types/PresenceContextType';

export const PresenceContext = createContext<PresenceContextType | undefined>(
  undefined
);
