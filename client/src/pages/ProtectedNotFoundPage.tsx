import type { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProtectNotFound = (): JSX.Element => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    const webHistory = window.history;

    if (webHistory.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="mt-2 text-lg font-semibold">Page Not Found</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Oops! This page doesn’t exist inside the app.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
            aria-label="Go back to the previous page"
          >
            ← Go Back
          </button>

          <Link
            to="/dashboard"
            className="block rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/chat"
            className="block rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Back to Chat
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProtectNotFound;
