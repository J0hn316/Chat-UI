import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { user, isLoading } = useAuth();

  // If loading, show spinner
  if (isLoading) return <LoadingSpinner />;

  return user ? children : <Navigate to="/login" replace />;
}
