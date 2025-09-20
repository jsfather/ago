'use client';

import { useState, useEffect } from 'react';

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

export default function JokeComponent() {
  const [joke, setJoke] = useState<JokeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingJoke, setPendingJoke] = useState<JokeResponse | null>(null);

  // Cleanup effect to restore scroll when component unmounts
  useEffect(() => {
    return () => {
      // No longer needed since we're not managing body scroll
    };
  }, []);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://v2.jokeapi.dev/joke/Programming,Dark'
      );
      const jokeData: JokeResponse = await response.json();

      if (!jokeData.safe) {
        setPendingJoke(jokeData);
        setShowWarning(true);
      } else {
        setJoke(jokeData);
        setShowWarning(false);
      }
    } catch (error) {
      console.error('Failed to fetch joke:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowUnsafeJoke = () => {
    if (pendingJoke) {
      setJoke(pendingJoke);
      setPendingJoke(null);
    }
    setShowWarning(false);
  };

  const handleCancelUnsafeJoke = () => {
    setPendingJoke(null);
    setShowWarning(false);
  };

  const handleCloseJoke = () => {
    setJoke(null);
    setPendingJoke(null);
    setShowWarning(false);
  };

  const getActiveFlags = (flags: JokeResponse['flags']) => {
    return Object.entries(flags)
      .filter(([, value]) => value)
      .map(([key]) => key);
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

  return (
    <div className="mx-auto w-full max-w-md font-mono" dir="ltr">
      {/* Joke trigger button and close button */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={fetchJoke}
          disabled={loading}
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
        {(joke || showWarning) && (
          <button
            onClick={handleCloseJoke}
            className="liquid-glass-subtle px-4 py-3 text-white/80 transition-all duration-300 hover:scale-105 hover:text-white/95"
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
      {showWarning && pendingJoke && (
        <div className="liquid-glass overflow-hidden">
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
                This joke may contain inappropriate content. Are you sure you
                want to see it?
              </p>

              {/* Show active flags */}
              {getActiveFlags(pendingJoke.flags).length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {getActiveFlags(pendingJoke.flags).map((flag) => (
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
      {joke && !showWarning && (
        <div className="liquid-glass overflow-hidden">
          <div className="relative space-y-4 p-6">
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
      )}
    </div>
  );
}
