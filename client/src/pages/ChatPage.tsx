import type { JSX } from 'react';
import { useState, useEffect, useRef } from 'react';

import { socket } from '../utils/socket';
import type { User } from '../types/User';
import { useAuth } from '../hooks/useAuth';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';

const ChatPage = (): JSX.Element => {
  const [isListOpen, setIsListOpen] = useState(false); // Mobile drawer state for the UserList
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Currently selected conversation partner

  // refs for focus management
  const panelRef = useRef<HTMLDivElement>(null); // Drawer panel container
  const triggerRef = useRef<HTMLButtonElement>(null); // Conversations button

  const { user } = useAuth();

  // Close drawer and return focus to trigger
  const closeList = () => {
    setIsListOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const openList = () => {
    setIsListOpen(true);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  // Find focusable children within a container
  const getFocusable = (root: HTMLElement): HTMLElement[] => {
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(
      (el) => el.offsetParent !== null || el.getClientRects().length > 0
    );
  };

  // Join the user's room when the component mounts
  useEffect(() => {
    if (user?._id) socket.emit('join', user._id);
  }, [user?._id]);

  // Close drawer when a user is picked
  useEffect(() => {
    if (selectedUser) setIsListOpen(false);
  }, [selectedUser]);

  // ESC closes drawer on mobile
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsListOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus trap effect
  useEffect(() => {
    if (!isListOpen || !panelRef.current) return;

    const panel = panelRef.current;

    // Move focus inside on open
    const firstFocusAble = getFocusable(panel)[0];
    (firstFocusAble ?? panel).focus();

    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeList();
        return;
      }

      if (evt.key !== 'Tab') return;

      const focusAbles = getFocusable(panel);
      if (focusAbles.length === 0) return;

      const first = focusAbles[0];
      const last = focusAbles[focusAbles.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active) return;

      if (!evt.shiftKey && active === last) {
        evt.preventDefault();
        first.focus();
      } else if (evt.shiftKey && active === first) {
        evt.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isListOpen]);

  return (
    <div className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-72px)] flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* ===== Desktop sidebar ===== */}
      <aside className="hidden md:block md:w-1/3 lg:w-1/4 p-4 border-r border-gray-300 dark:border-gray-700">
        <UserList
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?._id ?? null}
        />
      </aside>

      {/* ===== Mobile drawer (UserList) ===== */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          isListOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isListOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity
              ${
                isListOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
          onClick={closeList}
          aria-hidden="true"
        />
        {/* Drawer Panel */}
        <div
          id="mobile-conversations"
          ref={panelRef}
          tabIndex={-1}
          inert={!isListOpen || undefined}
          className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white dark:bg-gray-800 shadow-xl
              transform transition-transform duration-200
              ${isListOpen ? 'translate-x-0' : '-translate-x-full'}`}
          role={isListOpen ? 'dialog' : undefined}
          aria-modal={isListOpen ? 'true' : undefined}
          aria-label="Conversations"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold">Conversations</h2>
            <button
              className="rounded px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700"
              onClick={closeList}
            >
              Close
            </button>
          </div>
          <div className="p-4">
            <UserList
              onSelectUser={(u) => {
                setSelectedUser(u);
                closeList();
              }}
              selectedUserId={selectedUser?._id ?? null}
            />
          </div>
        </div>
      </div>

      {/* Chat window */}
      <section className="flex-1 p-2 sm:p-4">
        {/* Mobile header row with toggle */}
        <div className="md:hidden mb-3 flex items-center justify-between">
          <button
            onClick={openList}
            className="inline-flex items-center gap-2 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700"
          >
            ☰ Chats
          </button>
          {selectedUser && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Chatting with{' '}
              <span className="font-semibold">{selectedUser.username}</span>
            </div>
          )}
        </div>
        {selectedUser ? (
          <ChatWindow
            userId={selectedUser._id}
            username={selectedUser.username}
          />
        ) : (
          <div className="h-[60vh] md:h-full grid place-items-center text-center text-gray-500 dark:text-gray-400">
            <div>
              <p className="text-lg font-medium">
                Select a user to start chatting 💬
              </p>
              <p className="mt-1 text-sm md:hidden">
                Tap <span className="font-semibold">“Chats”</span> to pick
                someone.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
