import type { User } from './User';

export interface PresenceUser extends User {
  isOnline?: boolean;
  lastSeen?: string | null;
}
