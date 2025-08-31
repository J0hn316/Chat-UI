import type { AxiosError } from 'axios';
import { useMemo, useState } from 'react';
import type { JSX, FormEvent, ChangeEvent } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

import api from '../utils/api';

const RestPasswordPage = (): JSX.Element => {
  const [confirm, setConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const email = useMemo(() => params.get('email') ?? '', [params]);

  const handlePassword = (evt: ChangeEvent<HTMLInputElement>): void => {
    const password = evt.target.value;
    setPassword(password);
  };
  const handleConfirm = (evt: ChangeEvent<HTMLInputElement>): void => {
    const confirm = evt.target.value;
    setConfirm(confirm);
  };

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    evt.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    if (!token || !email) {
      setError('Invalid or missing reset token.');
      setSubmitting(false);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/reset-password', {
        token,
        email,
        password,
        confirmPassword: confirm,
      });
      setMessage('Password has been reset. You can now login.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ?? 'Registration failed.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold dark:text-gray-300">
          Reset Password
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Choose a new password for{' '}
          <span className="font-medium">{email || 'your account'}</span>
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
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 dark:text-gray-300"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={handlePassword}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:text-gray-300 dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use at least 8 characters.
            </p>
          </div>
          <div>
            <label
              htmlFor="confirm"
              className="block text-sm mb-1 dark:text-gray-300"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="••••••••"
              value={confirm}
              onChange={handleConfirm}
              required
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:text-gray-300 dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium disabled:opacity-70 hover:bg-blue-700 transition"
          >
            {submitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Changed your mind?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RestPasswordPage;
