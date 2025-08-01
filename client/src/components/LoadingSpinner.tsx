import type { JSX } from 'react';

export default function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-400 dark:bg-gray-800">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
