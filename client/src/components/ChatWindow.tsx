import type { JSX } from 'react';
import { useEffect, useState, useRef } from 'react';

import { socket } from '../utils/socket';
import { useAuth } from '../hooks/useAuth';
import { debounce } from '../utils/debounce';
import LoadingSpinner from './LoadingSpinner';
import type { ChatMessage } from '../api/chatApi';

import {
  myReactionSet,
  countReactions,
  togglerReactionLocal,
} from '../utils/reactions';

import {
  getMessagesWithUser,
  sendMessage,
  markMessagesRead,
  toggleMessageReaction,
} from '../api/chatApi';

interface ChatWindowProps {
  userId: string;
  username: string;
}

const REACTIONS = ['👍', '❤️', '😂', '🎉', '😮', '😢'];

const ChatWindow = ({ userId, username }: ChatWindowProps): JSX.Element => {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pickerFor, SetPickerFor] = useState<string | null>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Reference to scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const currentUserId = user?._id ?? '';

  // Close the picker (used on Esc / blur / click outside)
  const closePicker = () => SetPickerFor(null);

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

  const openPickerFor = (msgId: string) =>
    SetPickerFor((curr) => (curr === msgId ? null : msgId));

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

  // when input changes, emit typing & schedule stop
  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setContent(evt.target.value);
    if (!currentUserId) return;

    emitTyping(userId, currentUserId);
    debouncedStopTyping(userId, currentUserId);
  };

  const onToggleReaction = async (
    msgId: string,
    emoji: string
  ): Promise<void> => {
    if (!currentUserId) return;

    // optimistic update
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === msgId
          ? togglerReactionLocal(msg, currentUserId, emoji)
          : msg
      )
    );

    try {
      const updated = await toggleMessageReaction(msgId, emoji);
      // replace with server's canonical version
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updated._id ? updated : msg))
      );
    } catch (err) {
      console.error('Toggle reaction failed:', err);
    }
  };

  // --- effects --------------------------------------------------------------

  // Listen for typing events
  useEffect(() => {
    // fallback auto-clear after 3s (missed stop event)
    let fallback: ReturnType<typeof setTimeout> | null = null;

    const onTyping = ({ from }: { from: string }) => {
      if (from !== userId) return;
      setTypingUser(username);
      if (fallback) clearTimeout(fallback);
      fallback = setTimeout(() => setTypingUser(null), 3000);
    };

    const onStopTyping = ({ from }: { from: string }) => {
      if (from !== userId) return;
      setTypingUser(null);
      if (fallback) {
        clearTimeout(fallback);
        fallback = null;
      }
    };

    socket.on('userTyping', onTyping);
    socket.on('userStopTyping', onStopTyping);

    return () => {
      socket.off('userTyping', onTyping);
      socket.off('userStopTyping', onStopTyping);
      if (fallback) clearTimeout(fallback);
    };
  }, [userId, username]);

  // Fetch chat history
  useEffect(() => {
    let mounted = true;

    const loadingMessages = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await getMessagesWithUser(userId);
        if (mounted) setMessages(data);

        // Small delay avoids back-to-back network thrash
        setTimeout(() => {
          void markMessagesRead(userId);
        }, 150);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadingMessages();
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
      if (!currentUserId) return;

      // Only append if this message belongs to the current conversation
      const forThisChat =
        (msg.sender._id === userId && msg.recipient._id === currentUserId) ||
        (msg.sender._id === currentUserId && msg.recipient._id === userId);

      if (forThisChat) setMessages((prev) => [...prev, msg]);

      // If it's addressed to me, mark it read immediately
      if (msg.recipient._id === currentUserId && !msg.readAt)
        void markMessagesRead(userId);
    };

    socket.on('message:new', onNewMessage);
    return () => {
      socket.off('message:new', onNewMessage);
    };
  }, [userId, currentUserId]);

  // live read receipts
  useEffect(() => {
    const onRead = ({
      messageIds,
      readerId,
    }: {
      messageIds: string[];
      readerId: string;
    }): void => {
      // Only matters if other side read them
      if (readerId !== userId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id)
            ? { ...msg, readAt: new Date().toISOString() }
            : msg
        )
      );
    };
    socket.on('message:read', onRead);
    return () => {
      socket.off('message:read', onRead);
    };
  }, [userId]);

  // Socket real-time reaction updates
  useEffect(() => {
    const onReaction = ({ message }: { message: ChatMessage }) => {
      // Only update if the message belongs to this conversation
      const sameThread =
        (message.sender._id === userId &&
          message.recipient._id === currentUserId) ||
        (message.sender._id === currentUserId &&
          message.recipient._id === userId);

      if (!sameThread) return;

      setMessages((prev) =>
        prev.map((msg) => (msg._id === message._id ? message : msg))
      );
    };
    socket.on('message:reaction', onReaction);
    return () => {
      socket.off('message:reaction', onReaction);
    };
  }, [userId, currentUserId]);

  useEffect(() => {
    const onKey = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') closePicker();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // --- UI --------------------------------------------------------------
  return (
    <div className="flex flex-col min-h-[80vh] h-full w-full p-4 bg-white dark:bg-gray-800 rounded">
      <h2 className="text-xl font-semibold mb-4 text-blue-500">
        Chat with {username}
      </h2>

      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-100 dark:bg-gray-700 mb-3 space-y-2">
        {loading ? (
          <LoadingSpinner />
        ) : messages.length ? (
          messages.map((msg) => {
            const isSent = msg.sender._id === currentUserId;
            const counts = countReactions(msg.reactions);
            const mine = myReactionSet(msg.reactions, currentUserId);

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

                  <div className="text-sm text-gray-200 flex items-center mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}

                    {isSent && (
                      <span
                        className={`ml-2 text-xs ${
                          msg.readAt ? 'text-blue-200' : 'text-blue-300'
                        }`}
                        title={
                          msg.readAt
                            ? `Read ${new Date(msg.readAt).toLocaleString()}`
                            : 'Sent'
                        }
                      >
                        {msg.readAt ? '✅✅' : '✅'}
                      </span>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    {/* Existing reaction chips (click to toggle mine) */}
                    {Object.entries(counts).map(([emoji, count]) => (
                      <button
                        key={emoji}
                        title="Toggle reaction"
                        onClick={() => void onToggleReaction(msg._id, emoji)}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          mine.has(emoji)
                            ? 'bg-blue-200 text-blue-900'
                            : 'bg-white/70 dark:bg-black/20'
                        }`}
                      >
                        {emoji} {count > 1 ? count : ''}
                      </button>
                    ))}
                    {/* Add reaction button */}
                    <button
                      type="button"
                      title="Add reaction"
                      onClick={() => openPickerFor(msg._id)}
                      className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/60 hover:bg-white/80 dark:bg-black/30 border"
                    >
                      🤔
                    </button>
                    {/* Inline popover picker (appears only for this message) */}
                    {pickerFor === msg._id && (
                      <>
                        {/* backdrop to close on click outside */}
                        <button
                          aria-label="close reaction picker"
                          onClick={closePicker}
                          className="fixed inset-0 z-10 cursor-default"
                        />
                        <div
                          role="menu"
                          className="absolute z-20 -bottom-12 left-0 flex gap-1 rounded-full bg-white shadow-md px-2 py-1 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"
                        >
                          {REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              role="menuitem"
                              onClick={() => {
                                void onToggleReaction(msg._id, emoji);
                                closePicker();
                              }}
                              className="px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-base"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
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
};

export default ChatWindow;
