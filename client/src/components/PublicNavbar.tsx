import { useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import { useTheme } from '../hooks/useTheme';
import DarkModeToggle from './DarkModeToggle';

const PublicNavbar = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  const closeMenu = (): void => setIsOpen(false);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 sticky top-0 z-20">
      <div className="mx-3 flex max-w-full items-center justify-between">
        <Link to="/" className="text-lg font-semibold hover:text-accentBlue">
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
            aria-controls="public-navigation"
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
        <div className="hidden max-w-7xl mt-3 md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Link className="hover:text-accentBlue" to="/login">
              Login
            </Link>
            <Link className="hover:text-accentBlue" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div id="public-navigation" className="md:hidden mt-3 space-y-2">
          <Link
            className="block hover:text-accentBlue"
            to="/login"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link
            className="block hover:text-accentBlue"
            to="/register"
            onClick={closeMenu}
          >
            Register
          </Link>
          <div className="pt-2 border-t border-gray-700">
            <DarkModeToggle
              isDark={isDark}
              onToggle={() => {
                toggle();
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
