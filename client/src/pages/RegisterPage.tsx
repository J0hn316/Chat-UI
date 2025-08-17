import { useState } from 'react';
import type { AxiosError } from 'axios';
import type { JSX, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);

    try {
      const res = await api.post('/register', {
        username,
        email,
        password,
        confirmPassword,
      });
      await login(res.data.token);
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
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 dark:bg-gray-800">
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
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-blue-400 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
    </div>
  );
};

export default RegisterPage;
