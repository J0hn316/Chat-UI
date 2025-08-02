import type { JSX } from 'react';

export default function ChatPage(): JSX.Element {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4">
        <h2>Conversations</h2>
        {/* Placeholder for list */}
        <ul className="space-y-2">
          <li className="p-2 bg-blue-100 dark:bg-gray-700 rounded cursor-pointer">
            User 1
          </li>
          <li className="p-2 bg-blue-100 dark:bg-gray-700 rounded cursor-pointer">
            User 2
          </li>
        </ul>
      </aside>

      {/* Chat window */}
      <main className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-800 p-4 rounded mb-4">
          {/* Messages will go here */}
          <div className="mb-2">
            <div className="bg-blue-500 text-white p-2 rounded max-w-xs">
              <p>Hello! How can I help you today?</p>
            </div>
            <div className="mb-2 text-right">
              <div className="bg-gray-300 dark:bg-gray-600 text-black dark:text-white p-2 rounded max-w-xs inline-block">
                <p>Hi! How are you?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message input */}
        <form className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-l border border-gray-300 dark:border-gray-700 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
