import { useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import type { JSX, FormEvent, ChangeEvent } from 'react';

import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUser = (evt: ChangeEvent<HTMLInputElement>): void => {
    const username = evt.target.value;
    setUsername(username);
  };

  const handleEmail = (evt: ChangeEvent<HTMLInputElement>): void => {
    const email = evt.target.value;
    setEmail(email);
  };

  const handlePassword = (evt: ChangeEvent<HTMLInputElement>): void => {
    const password = evt.target.value;
    setPassword(password);
  };

  const handleConfirmPassword = (evt: ChangeEvent<HTMLInputElement>): void => {
    const confirmPassword = evt.target.value;
    setConfirmPassword(confirmPassword);
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/users/register', {
        username,
        email,
        password,
        confirmPassword,
      });
      await login(res.data.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message =
        axiosError?.response?.data?.message ?? 'Registration failed.';
      setError(message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <header className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Create an account.
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Sign up to start chatting.
        </p>
      </header>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
        {error && (
          <p
            role="alert"
            aria-live="assertive"
            className="mb-4 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="your name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={handleUser}
              required
            />
          </div>

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
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handlePassword}
              required
              // Optional: enforce minimum length on client
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Use at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;

{
  /* <div className="min-h-screen flex items-center justify-center bg-gray-400 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-400">
          Create an Account
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUser}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div> */
}
