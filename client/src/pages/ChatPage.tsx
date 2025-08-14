import type { JSX } from 'react';
import { useState, useEffect } from 'react';

import { socket } from '../utils/socket';
import type { User } from '../types/User';
import { useAuth } from '../hooks/useAuth';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      // Join the user's room when the component mounts
      socket.emit('join', user._id);
      console.log(`🔵 Joined room for user: ${user._id}`);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* User list sidebar */}
      <div className="w-1/3 p-4 border-r border-gray-300 dark:border-gray-700">
        <UserList
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?._id ?? null}
        />
      </div>

      {/* Chat window */}
      <div className="w-2/3 p-4">
        {selectedUser ? (
          <ChatWindow
            userId={selectedUser._id}
            username={selectedUser.username}
          />
        ) : (
          <div className="text-center text-lg text-gray-500 dark:text-gray-400">
            Select a user to start chatting 💬
          </div>
        )}
      </div>
    </div>
  );
}
