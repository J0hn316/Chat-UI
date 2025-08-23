import { useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const Navbar = (): JSX.Element => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (): void => setIsOpen(false);
  const toggleMenu = (): void => setIsOpen((prev) => !prev);

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between bg-gray-800 text-white p-4">
      <Link to="/home" className="text-lg font-semibold hover:text-blue-500">
        Chat UI
      </Link>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMenu}
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Mobile dropdown */}
      {isOpen && (
        <div id="primary-navigation" className="mt-3 space-y-2 md:hidden">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Chat
              </Link>
              <Link
                to="/about"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                About
              </Link>
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                Register
              </Link>
              <Link
                to="/about"
                className="block hover:text-blue-500"
                onClick={closeMenu}
              >
                About
              </Link>
            </>
          )}
        </div>
      )}

      {/* Desktop links */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        {user ? (
          <>
            {' '}
            <Link
              to="/dashboard"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/chat"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              Chat
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              About
            </Link>
            <button
              onClick={logout}
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              Register
            </Link>
            <Link
              to="/about"
              className="hover:text-blue-500"
              onClick={closeMenu}
            >
              About
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
//   <div className="flex space-x-4">
//     {user ? (
//       <>
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         <Link to="/chat" className="hover:underline">
//           Chat
//         </Link>
//         <Link to="/about" className="hover:underline">
//           About
//         </Link>
//       </>
//     ) : (
//       <>
//         <Link to="/login" className="hover:underline">
//           Login
//         </Link>
//         <Link to="/register" className="hover:underline">
//           Register
//         </Link>
//         <Link to="/about" className="hover:underline">
//           About
//         </Link>
//       </>
//     )}
//   </div>

//   {user && (
//     <div className="flex items-center space-x-4">
//       <span className="text-sm hidden sm:inline">👋 {user.username}</span>
//       <button
//         onClick={logout}
//         type="button"
//         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//       >
//         Logout
//       </button>
//     </div>
//   )}
// </nav>
