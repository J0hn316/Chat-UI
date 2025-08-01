import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
