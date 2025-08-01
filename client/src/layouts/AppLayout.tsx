import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Optional: Add navbar/sidebar here */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
