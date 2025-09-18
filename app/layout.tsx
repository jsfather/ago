import type { Metadata } from 'next';
import { iranSansXFaNum } from '@/app/fonts';
import '@/app/globals.css';
import ServiceWorkerRegister from '@/app/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'ago - Calculate elapsed time from a Jalali (Persian) date',
  description:
    'With the "ago" app, you can easily select a Jalali (Persian) date and see exactly how many years, months, and days have passed since then. A practical tool for revisiting memories, occasions, and important life moments.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ago',
  },
  icons: {
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${iranSansXFaNum.variable} font-iran-sans-x-fanum antialiased`}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
