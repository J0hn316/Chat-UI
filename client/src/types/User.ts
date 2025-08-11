export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  isOnline?: boolean;
  lastSeen?: string | null;
}
