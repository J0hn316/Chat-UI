import { useEffect } from 'react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage(): JSX.Element {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in and not loading, redirect to register
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome, {user?.username}!
      </h2>
      <p className="text-gray-700 dark:text-gray-200 mb-2">
        Email: {user?.email}
      </p>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        Joined: {new Date(user?.createdAt ?? '').toLocaleDateString()}
      </p>

      <button
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
