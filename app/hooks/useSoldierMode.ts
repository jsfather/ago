'use client';

import { useState, useEffect } from 'react';

interface SoldierModeSettings {
  isSoldier: boolean;
  explicitWords: boolean;
}

const STORAGE_KEY = 'soldier-mode';
const DEFAULT_SETTINGS: SoldierModeSettings = {
  isSoldier: false,
  explicitWords: false,
};

export function useSoldierMode() {
  const [settings, setSettings] =
    useState<SoldierModeSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load soldier mode from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load soldier mode:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save soldier mode to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save soldier mode:', error);
      }
    }
  }, [settings, isLoaded]);

  const setIsSoldier = (value: boolean) => {
    setSettings((prev) => ({ ...prev, isSoldier: value }));
  };

  const setExplicitWords = (value: boolean) => {
    setSettings((prev) => ({ ...prev, explicitWords: value }));
  };

  return {
    isSoldier: settings.isSoldier,
    explicitWords: settings.explicitWords,
    setIsSoldier,
    setExplicitWords,
    isLoaded,
  };
}
