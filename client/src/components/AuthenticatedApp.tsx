import type { JSX } from 'react';

import App from '../App';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const AuthenticatedApp = (): JSX.Element => {
  const { isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return <App />;
};

export default AuthenticatedApp;
