'use client';

import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to get the resolved theme based on system preference
  const getResolvedTheme = (currentTheme: Theme): 'dark' | 'light' => {
    if (currentTheme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return 'dark'; // Default fallback
    }
    return currentTheme;
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (
        saved &&
        (saved === 'dark' || saved === 'light' || saved === 'system')
      ) {
        setTheme(saved as Theme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save theme to localStorage and apply to document whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
        // Apply resolved theme to document root
        const resolvedTheme = getResolvedTheme(theme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  }, [theme, isLoaded]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (isLoaded && theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        const resolvedTheme = getResolvedTheme(theme);
        document.documentElement.setAttribute('data-theme', resolvedTheme);
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme, isLoaded]);

  // Apply theme on initial load
  useEffect(() => {
    if (isLoaded) {
      const resolvedTheme = getResolvedTheme(theme);
      document.documentElement.setAttribute('data-theme', resolvedTheme);
    }
  }, [isLoaded, theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'system') return 'dark';
      if (prevTheme === 'dark') return 'light';
      return 'system';
    });
  };

  const resolvedTheme = getResolvedTheme(theme);

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoaded,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: theme === 'system',
  };
}
