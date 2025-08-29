import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'theme';

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
  if (saved) return saved;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme());

  // apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // react to OS scheme changes (optional)
  useEffect(() => {
    const os = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      // only auto-switch if user hasn't explicitly picked a theme yet
      if (!saved) setTheme(os.matches ? 'dark' : 'light');
    };
    os.addEventListener('change', handler);
    return () => os.removeEventListener('change', handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle, isDark: theme === 'dark' };
};
