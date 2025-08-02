import type { JSX } from 'react';
import { useState } from 'react';

import type { User } from '../types/User';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex">
      {/* User list sidebar */}
      <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 p-4">
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
