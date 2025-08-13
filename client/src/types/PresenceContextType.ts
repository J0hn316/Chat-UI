import type { PresenceUser } from './Presence';

export interface PresenceContextType {
  users: PresenceUser[];
  loading: boolean;
  refresh: () => Promise<void>;
  getById: (id: string) => PresenceUser | undefined;
}
