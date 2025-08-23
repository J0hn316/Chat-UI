import type { JSX } from 'react';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import api from '../utils/api';
import CardStats from '../components/CardStats';
import type { StatsResponse } from '../types/Stats';

const DashboardPage = (): JSX.Element => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<StatsResponse>('/stats', {
          signal: controller.signal,
        });
        if (!mounted) return;

        setStats(res.data);
      } catch (err: unknown) {
        // Ignore fetch aborts
        if (
          (err instanceof DOMException && err.name === 'AbortError') ||
          (err as AxiosError).code === 'ERR_CANCELED'
        ) {
          return;
        }

        // Axios error narrowing
        const ae = err as AxiosError<{ message?: string }>;
        const message = ae?.response?.data?.message ?? 'Failed to load stats.';
        setError(message);

        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
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

        {/* Reserve for future metric */}
        <CardStats title="Coming Soon" value={undefined} loading={loading} />
      </div>
    </section>
  );
};

export default DashboardPage;
