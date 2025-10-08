'use client';

import { useTheme } from '../hooks/useTheme';
import { useEffect } from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useTheme();

  // Initialize theme on mount
  useEffect(() => {
    // This will be handled by the useTheme hook
  }, []);

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
