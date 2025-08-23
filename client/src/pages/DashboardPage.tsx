import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import api from '../utils/api';
import type { StatsResponse } from '../types/Stats';
import CardStats from '../components/CardStats';

const DashboardPage = (): JSX.Element => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust the path if your server is mounted differently (e.g., /api/stats)
        const res = await api.get<StatsResponse>('/stats');
        if (!mounted) return;
        setStats(res.data);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to load stats.');
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Overview of app activity
        </p>
      </header>

      {/* Error */}
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Users */}
        <CardStats
          title="Total Users"
          value={stats?.usersCount}
          loading={loading}
        />

        {/* Messages */}
        <CardStats
          title="Total Messages"
          value={stats?.messagesCount}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
