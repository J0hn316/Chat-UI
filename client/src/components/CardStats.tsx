import type { JSX } from 'react';

interface CardStatsProps {
  title: string;
  value?: number; // optional keeps 0 valid while allowing undefined
  loading: boolean;
  subtitle?: string; // future-friendly (optional)
  icon?: JSX.Element; // future-friendly (optional)
}

const nf = new Intl.NumberFormat();

const CardStats = ({
  title,
  value,
  loading,
  subtitle,
  icon,
}: CardStatsProps): JSX.Element => {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      ) : (
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {value === undefined ? '—' : nf.format(value)}
        </p>
      )}
    </div>
  );
};

export default CardStats;
