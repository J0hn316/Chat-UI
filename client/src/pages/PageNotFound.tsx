import type { JSX } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = (): JSX.Element => {
  return (
    <section className="mx-auto w-full max-w-lg">
      <div className="text-center py-16">
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold">Page Not Found ⛔</p>

        <div className="mt-6">
          <Link
            to="/register"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Back to Register page
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
