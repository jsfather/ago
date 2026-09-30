# Ago

A Next.js web app that calculates and displays elapsed time from a Persian (Shamsi) date with a warm, Persian-first interface.

## What it does

- Takes a Persian date
- Calculates elapsed time from today
- Shows result in Persian: "2 سال، 3 ماه، 15 روز"
- Responsive dashboard with an elapsed-time dial, progress tracking, and jokes
- Coordinated light and dark themes

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

The shared design tokens in `app/globals.css` define warm paper surfaces,
botanical green, a persimmon accent, typography, borders, and spacing for both
light and dark themes. The dashboard, date editor, settings, onboarding dialog,
and exported joke images use the same visual language. Persian text and numbers
use the bundled IRANSansX font; controls support keyboard navigation and reduced
motion preferences.

The service-finished joke is a regular single joke in the shared renderer,
including its category, normal text size, close action, and image-sharing action.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
