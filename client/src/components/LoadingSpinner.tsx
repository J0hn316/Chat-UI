import type { JSX } from 'react';

const LoadingSpinner = (): JSX.Element => {
  return (
    <div className="flex space-x-2 justify-center items-center h-screen bg-gray-300 dark:bg-gray-900">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        ></span>
      ))}
    </div>
  );
};

export default LoadingSpinner;
