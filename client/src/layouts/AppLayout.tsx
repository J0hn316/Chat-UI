import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';

/**
 * AppLayout
 * - Mobile-first full-height page shell
 * - Handles safe-area insets (iOS/Android)
 * - Provides a max-width container for content pages
 */
const AppLayout = (): JSX.Element => {
  return (
    <div className="min-h-dvh bg-gray-300 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pb-[env(safe-area-inset-bottom)] pt-[calc(theme(space.4)+env(safe-area-inset-top))]">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
