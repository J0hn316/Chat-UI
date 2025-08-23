import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PresenceProvider from './context/PresenceContext';

// Importing pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import PageNotFound from './pages/NotFoundPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectNotFound from './pages/ProtectedNotFoundPage';

const App = (): JSX.Element => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PresenceProvider>
                <AppLayout />
              </PresenceProvider>
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Nested catch-all 404 (protected area only) */}
          <Route path="*" element={<ProtectNotFound />} />
        </Route>

        {/* Global Catch-all 404 for public/unknown roots */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
