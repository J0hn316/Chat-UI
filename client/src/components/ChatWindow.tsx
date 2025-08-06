import type { JSX } from 'react';
import { useEffect, useState, useRef } from 'react';

import { socket } from '../utils/socket';
import { useAuth } from '../hooks/useAuth';
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
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Reference to scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const currentUserId = user?._id;

  // Send message
  const handleSend = async (): Promise<void> => {
    if (!content.trim()) return;
    setSending(true);

    try {
      const newMessage = await sendMessage(userId, content);
      setMessages((prev) => [...prev, newMessage]);
      setContent('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/[\s_-]+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  // Handle Typing
  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setContent(evt.target.value);
    if (currentUserId)
      socket.emit('typing', { to: userId, from: currentUserId });
  };

  // Listen for typing events
  useEffect(() => {
    const handleUserTyping = ({ from }: { from: string }) => {
      if (from === userId) {
        setTypingUser(username);
        setTimeout(() => setTypingUser(null), 3000);
      }
    };
    socket.on('userTyping', handleUserTyping);
    return () => {
      socket.off('userTyping', handleUserTyping);
    };
  }, [userId, username]);

  // Fetch chat history
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

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Real time updates with socket
  useEffect(() => {
    const handleIncomingMessage = (msg: ChatMessage): void => {
      const isRelevant =
        msg.sender._id === userId ||
        msg.recipient._id === currentUserId ||
        (msg.sender._id === currentUserId && msg.recipient._id === userId);

      if (isRelevant) setMessages((prev) => [...prev, msg]);
    };
    socket.on('newMessage', handleIncomingMessage);

    return () => {
      socket.off('newMessage', handleIncomingMessage);
    };
  }, [userId, currentUserId]);

  return (
    <div className="flex flex-col min-h-[80vh] h-full w-full p-4 bg-white dark:bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-4 text-blue-500">
        Chat with {username}
      </h2>

      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-100 dark:bg-gray-700 mb-3 space-y-2">
        {loading ? (
          <LoadingSpinner />
        ) : messages.length > 0 ? (
          messages.map((msg) => {
            const isSent = msg.sender._id === currentUserId;

            return (
              <div
                key={msg._id}
                className={`flex items-start gap-2 ${
                  isSent ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender._id !== currentUserId && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {getInitials(msg.sender.username)}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg shadow max-w-[80%] sm:max-w-sm text-sm transition-all duration-200 ease-in transform ${
                    isSent
                      ? 'bg-blue-600 text-white translate-x-2'
                      : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white -translate-x-2'
                  }`}
                >
                  <span className="block font-semibold">
                    {msg.sender._id === currentUserId
                      ? 'You'
                      : msg.sender.username || 'Unknown'}
                  </span>
                  <span className="block">{msg.content}</span>
                  <span className="block text-xs text-black dark:text-gray-300 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 dark:text-gray-300">
            No messages yet. Start the conversation!
          </p>
        )}
        {typingUser && (
          <div className="text-xs text-gray-500 dark:text-gray-300 italic mb-2">
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded dark:bg-gray-600"
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
