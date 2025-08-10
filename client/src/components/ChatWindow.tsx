import type { JSX } from 'react';
import { useEffect, useState, useRef } from 'react';

import { socket } from '../utils/socket';
import { useAuth } from '../hooks/useAuth';
import { debounce } from '../utils/debounce';
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
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Reference to scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const currentUserId = user?._id;

  // --- helpers --------------------------------------------------------------
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/[\s_-]+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  const emitTyping = (to: string, from: string): void => {
    socket.emit('typing', { to, from });
  };

  const emitStopTyping = (to: string, from: string): void => {
    socket.emit('stopTyping', { to, from });
  };

  const debouncedStopTyping = useRef(
    debounce((to: string, from: string) => {
      emitStopTyping(to, from);
    }, 1000)
  ).current;

  // --- send & input handlers ------------------------------------------------

  // Send message
  const handleSend = async (): Promise<void> => {
    if (!content.trim() || !currentUserId) return;
    setSending(true);

    try {
      const newMessage = await sendMessage(userId, content);
      setMessages((prev) => [...prev, newMessage]);
      setContent('');

      emitStopTyping(userId, currentUserId);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleSend();
  };

  // Handle Typing
  // when input changes, emit typing & schedule stop
  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setContent(evt.target.value);
    if (!currentUserId) return;

    emitTyping(userId, currentUserId);
    debouncedStopTyping(userId, currentUserId);
  };

  // --- effects --------------------------------------------------------------

  // Listen for typing events
  useEffect(() => {
    const onTyping = ({ from }: { from: string }) => {
      if (from === userId) setTypingUser(username);
    };

    const onStopTyping = ({ from }: { from: string }) => {
      if (from === userId) setTypingUser(null);
    };

    socket.on('userTyping', onTyping);
    socket.off('userStopTyping', onStopTyping);

    // fallback auto-clear after 3s (missed stop event)
    let fallback: ReturnType<typeof setTimeout> | null = null;

    // Remove user is typing message
    const clearWithFallback = () => {
      if (fallback) clearTimeout(fallback);
      if (typingUser) {
        fallback = setTimeout(() => setTypingUser(null), 3000);
      }
    };

    const unsub = () => {
      socket.off('userTyping', onTyping);
      socket.off('userStopTyping', onStopTyping);
      if (fallback) clearTimeout(fallback);
    };

    // re-run fallback whenever flag changes
    clearWithFallback();
    return unsub;
  }, [userId, username, typingUser]);

  // Fetch chat history
  useEffect(() => {
    let mounted = true;

    const loadingMessages = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await getMessagesWithUser(userId);
        if (mounted) setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadingMessages();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Real-time incoming messages
  useEffect(() => {
    const onNewMessage = (msg: ChatMessage): void => {
      // Only append if this message belongs to the current conversation
      const forThisChat =
        (msg.sender._id === userId && msg.recipient._id === currentUserId) ||
        (msg.sender._id === currentUserId && msg.recipient._id === userId);

      if (forThisChat) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('message:new', onNewMessage);
    return () => {
      socket.off('message:new', onNewMessage);
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
