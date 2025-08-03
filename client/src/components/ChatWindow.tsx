import type { JSX } from 'react';
import { useEffect, useState, useRef } from 'react';

import LoadingSpinner from './LoadingSpinner';
import type { ChatMessage } from '../api/chatApi';
import { getMessagesWithUser, sendMessage } from '../api/chatApi';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col min-h-[80vh] h-full w-full p-4 bg-white dark:bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-4 text-blue-500">
        Chat with {username}
      </h2>

      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-100 dark:bg-gray-700 mb-3 space-y-2">
        {loading ? (
          <LoadingSpinner />
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-blue-100 dark:bg-blue-600 text-sm p-2 rounded"
            >
              <strong>{msg.sender.username}</strong>:{msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            No messages yet. Start the conversation!
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
