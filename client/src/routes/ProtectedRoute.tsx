import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { user, isLoading } = useAuth();

  // Optionally, you can show a loading spinner or message
  if (isLoading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
}
