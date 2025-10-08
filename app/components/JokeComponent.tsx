'use client';

import { useState, useEffect, useRef } from 'react';
import { Share2 } from 'lucide-react';
import { useJokeSettings } from '../hooks/useJokeSettings';

interface JokeResponse {
  error: boolean;
  category: string;
  type: 'single' | 'twopart';
  joke?: string; // for single type
  setup?: string; // for twopart type
  delivery?: string; // for twopart type
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  safe: boolean;
  id: number;
  lang: string;
}

interface MultipleJokesResponse {
  error: boolean;
  amount: number;
  jokes: JokeResponse[];
}

export default function JokeComponent() {
  const [jokes, setJokes] = useState<JokeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingJokes, setPendingJokes] = useState<JokeResponse[]>([]);
  const { buildApiUrl, isLoaded, settings } = useJokeSettings();

  // Cleanup effect to restore scroll when component unmounts
  useEffect(() => {
    return () => {
      // No longer needed since we're not managing body scroll
    };
  }, []);

  const fetchJoke = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const apiUrl = buildApiUrl();
      const response = await fetch(apiUrl);
      const data = await response.json();

      let jokesArray: JokeResponse[] = [];

      if (data.error) {
        console.error('API Error:', data);
        return;
      }

      // Handle single vs multiple jokes response
      if (settings.amount > 1) {
        const multipleData = data as MultipleJokesResponse;
        jokesArray = multipleData.jokes;
      } else {
        const singleData = data as JokeResponse;
        jokesArray = [singleData];
      }

      // Check for unsafe jokes
      const unsafeJokes = jokesArray.filter((joke) => !joke.safe);

      if (unsafeJokes.length > 0 && !settings.safeMode) {
        setPendingJokes(jokesArray);
        setShowWarning(true);
      } else {
        setJokes(jokesArray);
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Failed to fetch joke:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowUnsafeJoke = () => {
    if (pendingJokes.length > 0) {
      setJokes(pendingJokes);
      setPendingJokes([]);
    }
    setShowWarning(false);
  };

  const handleCancelUnsafeJoke = () => {
    setPendingJokes([]);
    setShowWarning(false);
  };

  const handleCloseJoke = () => {
    setJokes([]);
    setPendingJokes([]);
    setShowWarning(false);
  };

  const getActiveFlags = (flags: JokeResponse['flags']) => {
    return Object.entries(flags)
      .filter(([, value]) => value)
      .map(([key]) => key);
  };

  const getAllActiveFlagsFromJokes = (jokes: JokeResponse[]) => {
    const allFlags = new Set<string>();
    jokes.forEach((joke) => {
      getActiveFlags(joke.flags).forEach((flag) => allFlags.add(flag));
    });
    return Array.from(allFlags);
  };

  const getFlagColor = (flag: string) => {
    const colors: { [key: string]: string } = {
      nsfw: 'bg-red-500/20 text-red-300 border-red-500/30',
      religious: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      political: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      racist: 'bg-red-600/20 text-red-400 border-red-600/30',
      sexist: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      explicit: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return colors[flag] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const createJokeImage = async (joke: JokeResponse) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper function for rounded rectangles
    const roundRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    // Calculate dimensions based on actual CSS classes
    const cardMaxWidth = 448; // max-w-md in pixels (28rem = 448px)
    const cardPadding = 48; // p-6 = 24px * 2 sides = 48px total
    const spaceY4 = 16; // space-y-4 = 1rem = 16px
    const spaceY3 = 12; // space-y-3 = 0.75rem = 12px
    const cardMargin = 32; // Margin around the card for better visibility

    // Calculate content width (inside p-6 padding)
    const contentWidth = cardMaxWidth - cardPadding;

    // Set fonts for measurements
    ctx.font = '500 14px monospace'; // text-sm font-medium
    const categoryText = joke.category;
    const categoryMetrics = ctx.measureText(categoryText);
    const categoryBadgeWidth = categoryMetrics.width + 32; // px-4 = 16px * 2 = 32px
    const categoryBadgeHeight = 28; // py-2 = 8px * 2 + font height

    // Calculate joke content dimensions
    ctx.font = '500 18px monospace'; // text-lg font-medium, leading-relaxed
    const lineHeight = Math.floor(18 * 1.625); // leading-relaxed = 1.625

    let contentHeight = 0;
    let deliveryBoxHeight = 0;

    if (joke.type === 'single') {
      const lines = wrapText(ctx, joke.joke || '', contentWidth);
      contentHeight = lines.length * lineHeight;
    } else {
      const setupLines = wrapText(ctx, joke.setup || '', contentWidth);
      const setupHeight = setupLines.length * lineHeight;

      // Delivery box: px-4 py-3 = 16px horizontal, 12px vertical * 2 = 24px
      const deliveryPadding = 24; // py-3 = 12px * 2
      const deliveryContentWidth = contentWidth - 32; // px-4 = 16px * 2
      ctx.font = '600 18px monospace'; // text-lg font-semibold
      const deliveryLines = wrapText(
        ctx,
        joke.delivery || '',
        deliveryContentWidth
      );
      const deliveryContentHeight = deliveryLines.length * lineHeight;
      deliveryBoxHeight = deliveryContentHeight + deliveryPadding;

      contentHeight = setupHeight + spaceY3 + deliveryBoxHeight;
    }

    // Calculate flags height if any
    const activeFlags = getActiveFlags(joke.flags);
    let flagsHeight = 0;
    if (joke.safe && activeFlags.length > 0) {
      flagsHeight = spaceY4 + 1 + 16; // border-t + pt-4 + flag height (py-1 = 4px * 2 + 12px font)
    }

    // Total card content height: p-6 + category + space-y-4 + content + space-y-4 + flags
    let cardContentHeight = cardPadding; // p-6 top and bottom
    cardContentHeight += categoryBadgeHeight; // category badge
    cardContentHeight += spaceY4; // space-y-4 after category
    cardContentHeight += contentHeight; // joke content
    if (flagsHeight > 0) {
      cardContentHeight += flagsHeight; // flags section if present
    }

    // Set final canvas size
    canvas.width = cardMaxWidth + cardMargin * 2;
    canvas.height = cardContentHeight + cardMargin * 2;

    // Create gradient background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, '#081827');
    gradient.addColorStop(1, '#0a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card positioning
    const cardX = cardMargin;
    const cardY = cardMargin;
    const cardWidth = cardMaxWidth;
    const cardHeight = cardContentHeight;

    // Glass background
    const glassGradient = ctx.createLinearGradient(
      cardX,
      cardY,
      cardX + cardWidth,
      cardY + cardHeight
    );
    glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');

    ctx.fillStyle = glassGradient;
    roundRect(cardX, cardY, cardWidth, cardHeight, 24);
    ctx.fill();

    // Add border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    roundRect(cardX, cardY, cardWidth, cardHeight, 24);
    ctx.stroke();

    // Start content positioning (p-6 = 24px from top)
    let currentY = cardY + 24;

    // Category badge
    ctx.font = '500 14px monospace'; // text-sm font-medium
    const categoryBadgeX = (canvas.width - categoryBadgeWidth) / 2;

    // Category badge background
    const categoryBadgeGradient = ctx.createLinearGradient(
      categoryBadgeX,
      currentY,
      categoryBadgeX + categoryBadgeWidth,
      currentY + categoryBadgeHeight
    );
    categoryBadgeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    categoryBadgeGradient.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
    ctx.fillStyle = categoryBadgeGradient;
    roundRect(
      categoryBadgeX,
      currentY,
      categoryBadgeWidth,
      categoryBadgeHeight,
      20
    );
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(
      categoryBadgeX,
      currentY,
      categoryBadgeWidth,
      categoryBadgeHeight,
      20
    );
    ctx.stroke();

    // Category text (centered in badge)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const categoryTextY = currentY + categoryBadgeHeight / 2 + 5; // Center vertically
    ctx.fillText(categoryText, categoryBadgeX + 16, categoryTextY);

    currentY += categoryBadgeHeight + spaceY4; // space-y-4

    // Joke content
    ctx.font = '500 18px monospace'; // text-lg font-medium
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    if (joke.type === 'single') {
      const lines = wrapText(ctx, joke.joke || '', contentWidth);
      lines.forEach((line) => {
        const lineMetrics = ctx.measureText(line);
        ctx.fillText(
          line,
          (canvas.width - lineMetrics.width) / 2,
          currentY + 18
        ); // baseline
        currentY += lineHeight;
      });
    } else {
      // Setup
      const setupLines = wrapText(ctx, joke.setup || '', contentWidth);
      setupLines.forEach((line) => {
        const lineMetrics = ctx.measureText(line);
        ctx.fillText(
          line,
          (canvas.width - lineMetrics.width) / 2,
          currentY + 18
        );
        currentY += lineHeight;
      });

      currentY += spaceY3; // space-y-3 between setup and delivery

      // Delivery background (liquid-glass-subtle rounded-2xl px-4 py-3)
      const deliveryContentWidth = contentWidth - 32; // px-4 = 16px * 2
      const deliveryLines = wrapText(
        ctx,
        joke.delivery || '',
        deliveryContentWidth
      );
      const deliveryX = cardX + 24 + 16; // card padding + px-4
      const deliveryWidth = deliveryContentWidth;

      const deliveryGradient = ctx.createLinearGradient(
        deliveryX,
        currentY,
        deliveryX + deliveryWidth,
        currentY + deliveryBoxHeight
      );
      deliveryGradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
      deliveryGradient.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
      ctx.fillStyle = deliveryGradient;
      roundRect(
        deliveryX - 16,
        currentY,
        deliveryWidth + 32,
        deliveryBoxHeight,
        20
      ); // Include px-4 padding
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      roundRect(
        deliveryX - 16,
        currentY,
        deliveryWidth + 32,
        deliveryBoxHeight,
        20
      );
      ctx.stroke();

      // Delivery text (py-3 = 12px top padding)
      ctx.font = '600 18px monospace'; // text-lg font-semibold
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      let deliveryY = currentY + 12 + 18; // py-3 top + baseline
      deliveryLines.forEach((line) => {
        const lineMetrics = ctx.measureText(line);
        ctx.fillText(line, (canvas.width - lineMetrics.width) / 2, deliveryY);
        deliveryY += lineHeight;
      });

      currentY += deliveryBoxHeight;
    }

    // Render flags if present and joke is safe (border-t border-white/10 pt-4)
    if (joke.safe && activeFlags.length > 0) {
      currentY += spaceY4; // space-y-4 before border

      // Draw border line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cardX + 24, currentY);
      ctx.lineTo(cardX + cardWidth - 24, currentY);
      ctx.stroke();

      currentY += 1 + 16; // border + pt-4

      // Calculate flags layout (gap-2 = 8px)
      ctx.font = '500 12px monospace'; // text-xs font-medium
      const flagGap = 8; // gap-2
      let totalFlagsWidth = 0;
      const flagWidths: number[] = [];

      activeFlags.forEach((flag) => {
        const flagMetrics = ctx.measureText(flag);
        const flagWidth = flagMetrics.width + 16; // px-2 = 8px * 2
        flagWidths.push(flagWidth);
        totalFlagsWidth += flagWidth;
      });
      totalFlagsWidth += (activeFlags.length - 1) * flagGap; // gaps between flags

      let flagX = (canvas.width - totalFlagsWidth) / 2;

      activeFlags.forEach((flag, index) => {
        const flagWidth = flagWidths[index];
        const flagHeight = 20; // py-1 = 4px * 2 + 12px font height

        // Flag background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        roundRect(flagX, currentY - 4, flagWidth, flagHeight, 8); // rounded-lg
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        roundRect(flagX, currentY - 4, flagWidth, flagHeight, 8);
        ctx.stroke();

        // Flag text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(flag, flagX + 8, currentY + 8); // px-2 + baseline

        flagX += flagWidth + flagGap;
      });
    }

    // Convert to blob and trigger download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `joke-${joke.id || Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  return (
    <div className="mx-auto w-full max-w-md font-mono" dir="ltr">
      {/* Joke trigger button and close button */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={fetchJoke}
          disabled={loading || !isLoaded}
          className="liquid-glass px-8 py-3 text-lg font-bold text-white/95 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90"></div>
              <span>Loading...</span>
            </div>
          ) : (
            'Tell me a joke'
          )}
        </button>

        {/* Close button - only show when joke is displayed */}
        {(jokes.length > 0 || showWarning) && (
          <button
            onClick={handleCloseJoke}
            className="liquid-glass-subtle animate-bloop-in px-4 py-3 text-white/80 transition-all duration-300 hover:scale-105 hover:text-white/95"
            title="Close joke"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Warning section - inline */}
      {showWarning && pendingJokes.length > 0 && (
        <div className="liquid-glass animate-bloop-bounce overflow-hidden">
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="liquid-glass-subtle mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white/95">
                    ⚠️ Warning
                  </h3>
                </div>
              </div>
              <p className="text-base leading-relaxed text-white/80">
                {pendingJokes.length === 1
                  ? 'This joke may contain inappropriate content. Are you sure you want to see it?'
                  : `${pendingJokes.length} jokes may contain inappropriate content. Are you sure you want to see them?`}
              </p>

              {/* Show active flags from all unsafe jokes */}
              {pendingJokes.length > 0 &&
                getAllActiveFlagsFromJokes(pendingJokes).length > 0 && (
                  <div className="mt-4">
                    <p className="mb-3 text-xs text-white/60">
                      Content warnings for{' '}
                      {pendingJokes.length === 1 ? 'this joke' : 'these jokes'}:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {getAllActiveFlagsFromJokes(pendingJokes).map((flag) => (
                        <span
                          key={flag}
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${getFlagColor(flag)}`}
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancelUnsafeJoke}
                className="liquid-glass-subtle px-8 py-3 font-medium text-white/80 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleShowUnsafeJoke}
                className="liquid-glass px-8 py-3 font-medium text-white/95 transition-all duration-300 hover:scale-105"
              >
                Show
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Joke display */}
      {jokes.length > 0 && !showWarning && (
        <div className="space-y-4">
          {jokes.map((joke, index) => (
            <div
              key={joke.id || index}
              className="liquid-glass animate-bloop-in overflow-hidden"
            >
              <div className="relative space-y-4 p-6">
                {/* Share button - positioned absolutely in top right */}
                <button
                  onClick={() => createJokeImage(joke)}
                  className="liquid-glass-subtle absolute top-3 right-3 p-2 text-white/70 transition-all duration-300 hover:scale-110 hover:text-white/90"
                  title="Share joke as image"
                >
                  <Share2 className="h-4 w-4" />
                </button>

                {/* Category badge */}
                <div className="flex justify-center">
                  <span className="liquid-glass-subtle px-4 py-2 text-sm font-medium text-white/80">
                    {joke.category}
                  </span>
                </div>

                {/* Joke content */}
                <div className="space-y-4 text-center">
                  {joke.type === 'single' ? (
                    <p className="text-lg leading-relaxed font-medium text-white/90">
                      {joke.joke}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-lg leading-relaxed font-medium text-white/90">
                        {joke.setup}
                      </p>
                      <div className="liquid-glass-subtle rounded-2xl px-4 py-3">
                        <p className="text-lg leading-relaxed font-semibold text-white/95">
                          {joke.delivery}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flags display for safe jokes */}
                {joke.safe && getActiveFlags(joke.flags).length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {getActiveFlags(joke.flags).map((flag) => (
                        <span
                          key={flag}
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${getFlagColor(flag)}`}
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
