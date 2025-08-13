import type { JSX } from 'react';

import type { User } from '../types/User';
import LoadingSpinner from './LoadingSpinner';
import { usePresence } from '../hooks/usePresence';

interface UserListProps {
  onSelectUser: (user: User) => void;
  selectedUserId: string | null;
}

export default function UserList({
  onSelectUser,
  selectedUserId,
}: UserListProps): JSX.Element {
  const { users, loading } = usePresence();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="w-1/3 border-r h-full overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4">
      <h3 className="font-bold mb-4 text-blue-500">Users</h3>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className={`p-2 rounded cursor-pointer flex items-center justify-between ${
            selectedUserId === user._id
              ? 'bg-blue-300 dark:bg-blue-600 text-white'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <span>{user.username}</span>
          <span
            className={`ml-2 h-2 w-2 rounded-full ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={
              user.isOnline
                ? 'Online'
                : user.lastSeen
                ? `Last seen: ${new Date(user.lastSeen).toLocaleString()}`
                : 'Offline'
            }
          />
        </div>
      ))}
    </div>
  );
}
