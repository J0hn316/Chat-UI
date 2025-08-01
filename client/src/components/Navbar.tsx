import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { JSX } from 'react';

export default function Navbar(): JSX.Element {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/chat" className="hover:underline">
              Chat
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
            <Link to="/about" className="hover:underline">
              About
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-sm hidden sm:inline">👋 {user.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
