import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import api from '../utils/api';
import type { User } from '../types/User';
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
        const res = await api.get('/users');
        setUsers(res.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-1/3 border-r h-full overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4">
      <h3 className="font-bold mb-4 text-blue-500">Users</h3>
      {loading ? (
        <LoadingSpinner />
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className={`p-2 rounded cursor-pointer ${
              selectedUserId === user._id
                ? 'bg-blue-300 dark:bg-blue-600 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => onSelectUser(user)}
          >
            {user.username}
          </div>
        ))
      )}
    </div>
  );
}
