import localFont from 'next/font/local';

const iranSansXFaNum = localFont({
  src: [
    {
      path: './fonts/IRANSansX/IRANSansXFaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/IRANSansX/IRANSansXFaNum-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-iran-sans-x-fanum',
});

export { iranSansXFaNum };
