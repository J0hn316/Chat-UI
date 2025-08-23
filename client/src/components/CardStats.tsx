import type { JSX } from 'react';

interface CardStatsProps {
  title: string;
  value: number | undefined;
  loading: boolean;
}

const CardStats = ({ title, value, loading }: CardStatsProps): JSX.Element => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      ) : (
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value ?? '—'}
        </p>
      )}
    </div>
  );
};

export default CardStats;
