import type { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

// Importing pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import PageNotFound from './pages/PageNotFound';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
