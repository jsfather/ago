'use client';

import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'dark' || saved === 'light')) {
        setTheme(saved as Theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
        // Apply theme to document root
        document.documentElement.setAttribute('data-theme', theme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  }, [theme, isLoaded]);

  // Apply theme on initial load
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [isLoaded, theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoaded,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
