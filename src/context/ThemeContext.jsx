/**
 * ThemeContext.jsx — Global dark/light mode state.
 *
 * - Reads saved preference from localStorage
 * - Falls back to system preference (prefers-color-scheme)
 * - Toggles `dark` class on <html> element (Tailwind darkMode: 'class')
 *
 * Usage:
 *   const { theme, toggleTheme, isDark } = useTheme();
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
  // Only use saved preference if user has explicitly toggled
  // Default is always 'light' (per design spec)
  const saved = localStorage.getItem('sp-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'light'; // ← always light by default
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sp-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
