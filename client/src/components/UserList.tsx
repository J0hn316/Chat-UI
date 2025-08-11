import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import { socket } from '../utils/socket';
import type { User } from '../types/User';
import { getUsers } from '../api/userApi';
import LoadingSpinner from './LoadingSpinner';

interface UserListProps {
  onSelectUser: (user: User) => void;
  selectedUserId: string | null;
}

export default function UserList({
  onSelectUser,
  selectedUserId,
}: UserListProps): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Live presence updates
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
      lastSeen: string;
    }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: false, lastSeen } : u
        )
      );
    };

    return () => {
      socket.off('presence:online', onOnline);
      socket.off('presence:offline', onOffline);
    };
  }, []);

  const formatLastSeen = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString() : '';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-1/3 border-r h-full overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4">
      <h3 className="font-bold mb-4 text-blue-500">Users</h3>
      {users.map((user) => {
        const isSelected = selectedUserId === user._id;
        return (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`p-2 rounded cursor-pointer flex items-center justify-between ${
              isSelected
                ? 'bg-blue-300 dark:bg-blue-600 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* presence dot */}
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
                title={user.isOnline ? 'Online' : 'Offline'}
              />
              <span>{user.username}</span>
            </div>
            {!user.isOnline && user.lastSeen && (
              <span className="text-xs text-gray-500 dark:text-gray-300">
                last seen {formatLastSeen(user.lastSeen)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
