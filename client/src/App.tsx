import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PresenceProvider from './context/PresenceContext';

import Navbar from './components/Navbar';

// Importing pages
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import PageNotFound from './pages/PageNotFound';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const App = (): JSX.Element => {
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
              <PresenceProvider>
                <AppLayout />
              </PresenceProvider>
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
};

export default App;
