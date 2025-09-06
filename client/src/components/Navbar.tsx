import { useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import DarkModeToggle from './DarkModeToggle';

const Navbar = (): JSX.Element => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const closeMenu = (): void => setIsOpen(false);
  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 sticky top-0 z-20">
      <div className="mx-auto flex max-w-full items-center justify-between">
        <Link
          to="/home"
          className="text-lg font-semibold hover:text-accentBlue"
        >
          Chat-UI
        </Link>

        <DarkModeToggle
          isDark={isDark}
          onToggle={toggle}
          className="hidden md:inline-flex mx-auto"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-controls="primary-navigation"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex md:items-center md:justify-between max-w-7xl mt-3">
          <div className="flex items-center ml-auto gap-6">
            <Link to="/dashboard" className="hover:text-accentBlue">
              Dashboard
            </Link>
            <Link to="/chat" className="hover:text-accentBlue">
              Chat
            </Link>
            <Link to="/about" className="hover:text-accentBlue">
              About
            </Link>
            <button
              onClick={logout}
              type="button"
              className="bg-rose-500 hover:bg-rose-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div id="primary-navigation" className="md:hidden mt-3 space-y-2">
          <Link
            to="/dashboard"
            className="block hover:text-accentBlue"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/chat"
            className="block hover:text-accentBlue"
            onClick={closeMenu}
          >
            Chat
          </Link>
          <Link
            to="/about"
            className="block hover:text-accentBlue"
            onClick={closeMenu}
          >
            About
          </Link>

          <DarkModeToggle
            isDark={isDark}
            onToggle={() => {
              toggle();
              closeMenu();
            }}
          />

          <div className="pt-2 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              type="button"
              className="bg-rose-500 hover:bg-rose-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
