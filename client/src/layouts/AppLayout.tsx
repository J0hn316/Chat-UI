import type { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';

export default function AppLayout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
