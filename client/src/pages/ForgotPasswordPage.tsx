import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import type { JSX, FormEvent } from 'react';

import api from '../utils/api';

const ForgotPasswordPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    evt.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await api.post('/forgot-password', { email });
      setMessage('If that email exists, a reset link has been sent.');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const msg =
        axiosError?.response?.data?.message ?? 'Unable to process request.';
      setError(msg);
      console.error('forgot-password error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold dark:text-white">
          Forgot Password
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Enter your email and we’ll send you a reset link.
        </p>
      </header>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
        {message && (
          <p
            role="status"
            className="mb-3 text-sm text-green-700 dark:text-green-400"
          >
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mb-3 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-1 dark:text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium disabled:opacity-70 hover:bg-blue-700 transition"
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Remembered your password?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
