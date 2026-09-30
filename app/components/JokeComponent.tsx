'use client';

import { useState } from 'react';
import { Share2, Smile, X, RefreshCw, LoaderCircle } from 'lucide-react';
import { useJokeSettings } from '../hooks/useJokeSettings';
import { SERVICE_FINISHED } from '../lib/features';
import { shareJokeImage } from '../lib/shareJokeImage';

export interface JokeResponse {
  category: string;
  type: 'single' | 'twopart';
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: Record<string, boolean>;
  safe: boolean;
  id: number;
  lang: string;
}

// Local jokes use exactly the same content model and card as API jokes.
const serviceJoke: JokeResponse = {
  category: 'Misc',
  type: 'single',
  joke: 'سربازیت تموم شد',
  flags: {},
  safe: true,
  id: -1,
  lang: 'fa',
};

export default function JokeComponent() {
  const [jokes, setJokes] = useState<JokeResponse[]>([]);
  const [pendingJokes, setPendingJokes] = useState<JokeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState<number | null>(null);
  const [error, setError] = useState('');
  const { buildApiUrl, isLoaded, settings } = useJokeSettings();

  const fetchJoke = async () => {
    setError('');
    if (SERVICE_FINISHED) {
      setJokes([serviceJoke]);
      setPendingJokes([]);
      return;
    }
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl());
      const data = await response.json();
      if (!response.ok || data.error) throw new Error('Joke request failed');
      const nextJokes: JokeResponse[] = data.jokes ?? [data];
      if (nextJokes.some((joke) => !joke.safe) && !settings.safeMode) {
        setPendingJokes(nextJokes);
      } else {
        setJokes(nextJokes);
        setPendingJokes([]);
      }
    } catch {
      setError('جوک دریافت نشد. دوباره امتحان کن.');
    } finally {
      setLoading(false);
    }
  };

  const share = async (joke: JokeResponse) => {
    setSharing(joke.id);
    setError('');
    try {
      await shareJokeImage(joke);
    } catch {
      setError('ذخیره تصویر انجام نشد. دوباره امتحان کن.');
    } finally {
      setSharing(null);
    }
  };
  const close = () => {
    setJokes([]);
    setPendingJokes([]);
    setError('');
  };
  const flags = [
    ...new Set(
      pendingJokes.flatMap((joke) =>
        Object.keys(joke.flags).filter((flag) => joke.flags[flag])
      )
    ),
  ];

  return (
    <section className="surface-card card-padding" aria-label="جوک">
      <div className="joke-intro">
        <span className="joke-icon">
          <Smile size={25} strokeWidth={1.6} />
        </span>
        <div>
          <h2>یه مکث، یه لبخند.</h2>
          <p>بین شمردن روزها، یه کم هم بخند.</p>
        </div>
      </div>
      <div className="flex gap-2" dir="ltr">
        <button
          onClick={fetchJoke}
          disabled={loading || (!SERVICE_FINISHED && !isLoaded)}
          className="button-secondary flex-1"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={15} />
          )}
          {loading ? 'Loading…' : 'Tell me a joke'}
        </button>
        {(jokes.length > 0 || pendingJokes.length > 0) && (
          <button
            onClick={close}
            className="icon-button"
            aria-label="Close joke"
          >
            <X size={17} />
          </button>
        )}
      </div>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
      {pendingJokes.length > 0 && (
        <div className="joke-warning" role="alert">
          <p>این جوک ممکنه محتوای نامناسب داشته باشه. نمایش داده بشه؟</p>
          <div className="my-3 flex flex-wrap gap-2" dir="ltr">
            {flags.map((flag) => (
              <span key={flag} className="badge">
                {flag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="button-primary"
              onClick={() => {
                setJokes(pendingJokes);
                setPendingJokes([]);
              }}
            >
              نمایش جوک
            </button>
            <button
              className="button-secondary"
              onClick={() => setPendingJokes([])}
            >
              بی‌خیال
            </button>
          </div>
        </div>
      )}
      <div aria-live="polite" aria-busy={loading}>
        {pendingJokes.length === 0 &&
          jokes.map((joke) => (
            <article
              key={joke.id}
              className="joke-card animate-enter"
              lang={joke.lang}
              dir={joke.lang === 'fa' ? 'rtl' : 'ltr'}
            >
              <div className="joke-card-header" dir="ltr">
                <span className="badge">{joke.category}</span>
                <button
                  className="icon-button"
                  onClick={() => share(joke)}
                  disabled={sharing !== null}
                  aria-label="Share joke as image"
                >
                  {sharing === joke.id ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Share2 size={16} />
                  )}
                </button>
              </div>
              <div className="joke-content">
                {joke.type === 'single' ? (
                  <p>{joke.joke}</p>
                ) : (
                  <>
                    <p>{joke.setup}</p>
                    <p className="joke-delivery">{joke.delivery}</p>
                  </>
                )}
              </div>
              {Object.keys(joke.flags).some((flag) => joke.flags[flag]) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.keys(joke.flags)
                    .filter((flag) => joke.flags[flag])
                    .map((flag) => (
                      <span key={flag} className="badge">
                        {flag}
                      </span>
                    ))}
                </div>
              )}
            </article>
          ))}
      </div>
    </section>
  );
}
