'use client';

import { useState, useEffect } from 'react';

export interface JokeSettings {
  categories: string[];
  blacklistFlags: string[];
  lang: string;
  type: 'single' | 'twopart' | 'any';
  safeMode: boolean;
  amount: number;
}

const defaultSettings: JokeSettings = {
  categories: ['Programming', 'Dark'],
  blacklistFlags: [],
  lang: 'en',
  type: 'any',
  safeMode: false,
  amount: 1,
};

const STORAGE_KEY = 'joke-settings';

export function useJokeSettings() {
  const [settings, setSettings] = useState<JokeSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load joke settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save joke settings:', error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<JokeSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Build API URL based on current settings
  const buildApiUrl = () => {
    const baseUrl = 'https://v2.jokeapi.dev/joke';
    const categories =
      settings.categories.length > 0 ? settings.categories.join(',') : 'Any';

    const params = new URLSearchParams();

    if (settings.blacklistFlags.length > 0) {
      params.append('blacklistFlags', settings.blacklistFlags.join(','));
    }

    if (settings.lang !== 'en') {
      params.append('lang', settings.lang);
    }

    if (settings.type !== 'any') {
      params.append('type', settings.type);
    }

    if (settings.safeMode) {
      params.append('safe-mode', '');
    }

    if (settings.amount > 1) {
      params.append('amount', settings.amount.toString());
    }

    const queryString = params.toString();
    return `${baseUrl}/${categories}${queryString ? '?' + queryString : ''}`;
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    buildApiUrl,
    isLoaded,
  };
}
