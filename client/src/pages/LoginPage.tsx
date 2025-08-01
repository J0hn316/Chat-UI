import { useState } from 'react';
import type { JSX } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/login', { email, password });
      const { token } = res.data;

      await login(token);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data.message === 'string'
      ) {
        setError(axiosError.response.data.message);
      } else {
        setError('Login failed. Please check your credentials.');
        console.error('Login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400 ">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
    </div>
  );
}
