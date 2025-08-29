import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = (): JSX.Element => {
  return (
    <div className="min-h-dvh bg-gray-300 dark:bg-gray-900">
      <PublicNavbar />
      <main className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
