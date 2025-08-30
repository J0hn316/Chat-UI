import type { JSX } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = (): JSX.Element => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in (and not loading), send to login
  useEffect(() => {
    if (!user && !isLoading) navigate('/login');
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="grid place-items-center min-h-[40vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const joined =
    user?.createdAt && !Number.isNaN(Date.parse(user.createdAt))
      ? new Date(user.createdAt).toLocaleDateString()
      : '—';

  const capitalizeFirstLetter = (string: string): string =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <>
      <header className="mx-auto text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">Home Page</h1>
        <p className="text-sm text-black dark:text-white">
          Welcome
          {user?.username ? `, ${capitalizeFirstLetter(user.username)}` : ''}
        </p>
      </header>
      <section className="w-full max-w-md mt-4">
        <div className="rounded-lg border border-gray-900 dark:border-gray-700 bg-blue-500 dark:bg-gray-800 shadow-sm p-4 sm:p-6 ">
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-black dark:text-gray-400">
                Email
              </p>
              <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                {user?.email ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-black dark:text-gray-400">
                Joined
              </p>
              <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                {joined}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full rounded-md bg-rose-400 text-white py-2.5 font-medium hover:bg-rose-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
