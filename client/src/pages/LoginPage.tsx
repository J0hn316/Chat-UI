import { useState } from 'react';
import type { JSX, FormEvent, ChangeEvent } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmail = (evt: ChangeEvent<HTMLInputElement>): void => {
    const email = evt.target.value;
    setEmail(email);
  };

  const handlePassword = (evt: ChangeEvent<HTMLInputElement>): void => {
    const password = evt.target.value;
    setPassword(password);
  };

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    evt.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/users/login', { email, password });
      const { token } = res.data;

      await login(token);
      navigate('/home');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ??
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">Welcome back.</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Log in to start chatting.
        </p>
      </header>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={handleEmail}
              required
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handlePassword}
              required
            />
          </div>
          {/* Error (announced by screen readers) */}
          {error && (
            <p
              role="alert"
              className=" text-red-500 text-sm"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
