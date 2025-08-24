import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import axios, { AxiosError, CanceledError } from 'axios';

import api from '../utils/api';
import { socket } from '../utils/socket';
import CardStats from '../components/CardStats';
import type { StatsResponse } from '../types/Stats';

const DashboardPage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [liveOnline, setLiveOnline] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<StatsResponse>('/stats', {
          signal: controller.signal,
        });

        setStats(res.data);
        setLiveOnline(res.data.onlineUsers ?? null);
      } catch (err: unknown) {
        // Ignore native AbortController cancellations (DOM)
        if (err instanceof DOMException && err.name === 'AbortError') return;

        // Ignore Axios cancellations
        if (err instanceof CanceledError) return;

        // Extra safety for older call sites
        if (axios.isCancel(err)) return;

        const ae = err as AxiosError<{ message?: string }>;
        const message = ae?.response?.data?.message ?? 'Failed to load stats.';

        setError(message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Socket listener for live online user count
  useEffect(() => {
    const onCount = (payload: { count: number }) => {
      setLiveOnline(payload.count);
    };
    socket.on('presence:onlineCount', onCount);
    return () => {
      socket.off('presence:onlineCount', onCount);
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
        <CardStats
          title="Total Users"
          value={stats?.usersCount}
          loading={loading}
        />

        <CardStats
          title="Total Messages"
          value={stats?.messagesCount}
          loading={loading}
        />

        <CardStats
          title="Messages Today"
          value={stats?.messagesToday}
          loading={loading}
        />

        <CardStats
          title="Online Users"
          value={liveOnline ?? stats?.onlineUsers}
          loading={loading && liveOnline == null}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
