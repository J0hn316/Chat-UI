import { useEffect, useState } from 'react';
import type { JSX } from 'react';

import type { ChatMessage } from '../api/chatApi';
import { getMessagesWithUser, sendMessage } from '../api/chatApi';
import LoadingSpinner from './LoadingSpinner';

interface ChatWindowProps {
  userId: string;
  username: string;
}

export default function ChatWindow({
  userId,
  username,
}: ChatWindowProps): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadingMessages = async (): Promise<void> => {
      setLoading(true);

      try {
        const data = await getMessagesWithUser(userId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };
    loadingMessages();
  }, [userId]);

  const handleSend = async (): Promise<void> => {
    if (!content.trim()) return;

    try {
      const newMessage = await sendMessage(userId, content);
      setMessages((prev) => [...prev, newMessage]);
      setContent('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col w-2/3 h-full p-4 bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-blue-500">
        Chat with {username}
      </h2>
      <div className="flex-1 overflow-y-auto border p-2 mb-2 rounded bg-gray-100 dark:bg-gray-700">
        {loading ? (
          <LoadingSpinner />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="mb-2 text-sm bg-blue-100 dark:bg-blue-600 p-2 rounded"
            >
              <span className="font-bold">{msg.sender}</span>: {msg.content}
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded dark:bg-gray-600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
