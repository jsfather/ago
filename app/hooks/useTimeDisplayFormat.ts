'use client';

import { useState, useEffect } from 'react';

export type TimeDisplayFormat = 'days' | 'months' | 'years';

const STORAGE_KEY = 'time-display-format';
const DEFAULT_FORMAT: TimeDisplayFormat = 'months';

export function useTimeDisplayFormat() {
  const [format, setFormat] = useState<TimeDisplayFormat>(DEFAULT_FORMAT);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load format from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['days', 'months', 'years'].includes(saved)) {
        setFormat(saved as TimeDisplayFormat);
      }
    } catch (error) {
      console.error('Failed to load time display format:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save format to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, format);
      } catch (error) {
        console.error('Failed to save time display format:', error);
      }
    }
  }, [format, isLoaded]);

  return {
    format,
    setFormat,
    isLoaded,
  };
}
