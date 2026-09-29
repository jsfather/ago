# Ago

A Next.js web app that calculates and displays elapsed time from a Persian (Shamsi) date with a modern dark interface.

## What it does

- Takes a Persian date
- Calculates elapsed time from today
- Shows result in Persian: "2 سال، 3 ماه، 15 روز"
- Beautiful minimal dark UI

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Built with Next.js + Tailwind CSS + ❤️

## Feature flag

`NEXT_PUBLIC_SERVICE_FINISHED` defaults to `true`. Clicking “Tell me a joke”
shows only «سربازیت تموم شد» as the joke, without an API request. The button
and joke settings remain available, and the joke can be closed and reopened.
To fetch regular jokes instead, add this to `.env.local`:

```dotenv
NEXT_PUBLIC_SERVICE_FINISHED=false
```

Restart the development server (or rebuild for production) after changing it.

## Appearance

Shared glass materials support light and dark themes, with a floating navigation
bar, subtle highlights, and opaque fallbacks when backdrop blur is unavailable.
Reduced motion, reduced transparency, and increased contrast preferences are
respected. The styling takes inspiration from
[Apple’s materials guidance](https://developer.apple.com/design/human-interface-guidelines/materials).
