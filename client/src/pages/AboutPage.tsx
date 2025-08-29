import type { JSX } from 'react';

const AboutPage = (): JSX.Element => {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <header className="mb-6 text-center">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-300">
          About
        </h1>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-300">
          Learn more about this project and what powers it.
        </p>
      </header>

      <article className="rounded-lg border border-gray-500 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-4 sm:p-6">
        <p className="text-base sm:text-lg text-gray-900 dark:text-gray-300">
          Welcome to the About Page 📖
        </p>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-300">
            What is Chat‑UI?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            Chat‑UI is a real‑time messaging app built with React + TypeScript
            and a Node/Express backend. It focuses on accessibility,
            performance, and a clean, mobile‑first UX.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-300">
            Key Features
          </h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            <li>Realtime messaging with Socket.IO</li>
            <li>
              Accessible mobile drawer with focus trap + <code>inert</code>
            </li>
            <li>Dark mode and responsive layout via Tailwind CSS</li>
            <li>Optimistic message sending with error rollback</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-300">
            Tech Stack
          </h2>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-white/50 dark:bg-gray-900/50">
              <p className="font-medium text-gray-900 dark:text-gray-300">
                Frontend
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                React, TypeScript, Tailwind
              </p>
            </div>
            <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 bg-white/50 dark:bg-gray-900/50">
              <p className="font-medium text-gray-900 dark:text-gray-300">
                Backend
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Node, Express, MongoDB
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-300">
            Contact
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            Have feedback or want to contribute?{' '}
            <a
              href="mailto:you@example.com"
              className="text-blue-600 hover:underline"
            >
              Email the maintainer
            </a>
            .
          </p>
        </section>
      </article>
    </section>
  );
};

export default AboutPage;
