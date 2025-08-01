import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Navbar from './components/Navbar';

// Importing pages
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import PageNotFound from './pages/PageNotFound';

export default function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
