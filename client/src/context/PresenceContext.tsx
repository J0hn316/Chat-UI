import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { socket } from '../utils/socket';
import { getUsers } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';
import type { PresenceUser } from '../types/Presence';
import { PresenceContext } from './PresenceContextInstance';

export default function PresenceProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, token } = useAuth();

  // initial fetch + manual refresh
  const refresh = async (): Promise<void> => {
    // 🚫 not logged in -> don't call the API
    if (!token) {
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getUsers(); // returns presence-enriched users
      setUsers(data);
    } catch (err) {
      console.error('Presence refresh failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => void refresh(), []);

  // join your personal room on connect and on reconnect
  useEffect(() => {
    if (!user?._id) return;

    const join = () => socket.emit('join', user._id);
    join(); // initial
    socket.on('connect', join); // reconnects

    return () => {
      socket.off('connect', join);
    };
  }, [user?._id]);

  // live presence updates
  useEffect(() => {
    const onOnline = ({ userId }: { userId: string }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: true, lastSeen: null } : u
        )
      );
    };

    const onOffline = ({
      userId,
      lastSeen,
    }: {
      userId: string;
      lastSeen: string | null;
    }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: false, lastSeen } : u
        )
      );
    };

    socket.on('presence:online', onOnline);
    socket.on('presence:offline', onOffline);

    return () => {
      socket.off('presence:online', onOnline);
      socket.off('presence:offline', onOffline);
    };
  }, []);

  const getById = (id: string): PresenceUser | undefined =>
    users.find((u) => u._id === id);

  return (
    <PresenceContext.Provider value={{ users, loading, refresh, getById }}>
      {children}
    </PresenceContext.Provider>
  );
}
