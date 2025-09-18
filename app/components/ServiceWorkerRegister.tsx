'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const isHttps = window.location.protocol === 'https:';

    if (isHttps || isLocalhost) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Service worker registration failed:', err);
        });
    }
  }, []);

  return null;
}

