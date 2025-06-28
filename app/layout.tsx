import type { Metadata } from 'next';
import { iranSansXFaNum } from '@/app/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'چقدر گذشته؟ - محاسبه زمان گذشته از یک تاریخ شمسی',
  description:
    'با اپلیکیشن «چقدر گذشته؟» می‌توانید به سادگی تاریخ شمسی مورد نظر خود را انتخاب کرده و ببینید دقیقاً چند سال، ماه و روز از آن زمان گذشته است. ابزاری کاربردی برای مرور خاطرات، مناسبت‌ها، و لحظات مهم زندگی.',
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
      </body>
    </html>
  );
}
