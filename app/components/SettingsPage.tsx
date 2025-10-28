'use client';

import {
  Calendar,
  CalendarDays,
  Calendar1,
  Moon,
  Sun,
  Laptop,
  Settings,
  Drama,
} from 'lucide-react';
import { useJokeSettings } from '../hooks/useJokeSettings';
import { useTheme } from '../hooks/useTheme';
import { useTimeDisplayFormat } from '../hooks/useTimeDisplayFormat';
import { useSoldierMode } from '../hooks/useSoldierMode';

const AVAILABLE_CATEGORIES = [
  'Any',
  'Misc',
  'Programming',
  'Dark',
  'Pun',
  'Spooky',
  'Christmas',
];

const AVAILABLE_FLAGS = [
  'nsfw',
  'religious',
  'political',
  'racist',
  'sexist',
  'explicit',
];

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'cs', name: 'Czech' },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, isLoaded } =
    useJokeSettings();
  const { theme, setTheme, isLoaded: themeLoaded } = useTheme();
  const {
    format,
    setFormat,
    isLoaded: timeFormatLoaded,
  } = useTimeDisplayFormat();
  const {
    isSoldier,
    explicitWords,
    setIsSoldier,
    setExplicitWords,
    isLoaded: soldierLoaded,
  } = useSoldierMode();

  if (!isLoaded || !themeLoaded || !timeFormatLoaded || !soldierLoaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 pt-6 pb-20"
        style={{ backgroundColor: 'var(--primary-bg)' }}
      >
        <div className="liquid-glass px-8 py-4">
          <div className="flex items-center space-x-2">
            <div
              className="h-4 w-4 animate-spin rounded-full border-2 border-t-white/90"
              style={{
                borderColor: 'var(--text-tertiary)',
                borderTopColor: 'var(--text-primary)',
              }}
            ></div>
            <span style={{ color: 'var(--text-secondary)' }}>
              Loading settings...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      updateSettings({
        categories: [...settings.categories, category],
      });
    } else {
      updateSettings({
        categories: settings.categories.filter((c) => c !== category),
      });
    }
  };

  const handleFlagChange = (flag: string, checked: boolean) => {
    if (checked) {
      updateSettings({
        blacklistFlags: [...settings.blacklistFlags, flag],
      });
    } else {
      updateSettings({
        blacklistFlags: settings.blacklistFlags.filter((f) => f !== flag),
      });
    }
  };

  const resetGeneralSettings = () => {
    setTheme('system');
    setFormat('months');
    setIsSoldier(false);
  };

  return (
    <div
      className="min-h-screen px-4 pt-6 pb-20"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div className="mx-auto max-w-md">
        {/* General Settings Section */}
        <div className="mb-6" dir="ltr">
          <div className="liquid-glass overflow-hidden">
            <div className="space-y-6 p-6">
              {/* Section Header */}
              <div
                className="border-b pb-4 text-center"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <h2
                  className="mb-2 flex items-center justify-center gap-2 text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Settings className="h-5 w-5" /> General Settings
                </h2>
                <p
                  className="font-mono text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Application preferences
                </p>
              </div>

              {/* Theme Selection */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Theme
                </h3>
                <div className="space-y-2">
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={(e) =>
                        setTheme(e.target.value as 'dark' | 'light' | 'system')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <Moon
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Dark Mode
                      </span>
                    </div>
                  </label>
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={(e) =>
                        setTheme(e.target.value as 'dark' | 'light' | 'system')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <Sun
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Light Mode
                      </span>
                    </div>
                  </label>
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={theme === 'system'}
                      onChange={(e) =>
                        setTheme(e.target.value as 'dark' | 'light' | 'system')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <Laptop
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        System
                      </span>
                    </div>
                  </label>
                </div>
                <p
                  className="mt-2 font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Choose your preferred theme or use system setting
                </p>
              </div>

              {/* Time Display Format */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Time Display Format
                </h3>
                <div className="space-y-2">
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="days"
                      checked={format === 'days'}
                      onChange={(e) =>
                        setFormat(e.target.value as 'days' | 'months' | 'years')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <CalendarDays
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Days
                      </span>
                    </div>
                  </label>
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="months"
                      checked={format === 'months'}
                      onChange={(e) =>
                        setFormat(e.target.value as 'days' | 'months' | 'years')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <Calendar
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Months
                      </span>
                    </div>
                  </label>
                  <label className="liquid-glass-subtle flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-200">
                    <input
                      type="radio"
                      name="timeFormat"
                      value="years"
                      checked={format === 'years'}
                      onChange={(e) =>
                        setFormat(e.target.value as 'days' | 'months' | 'years')
                      }
                      className="theme-checkbox h-4 w-4"
                    />
                    <div className="flex items-center space-x-2">
                      <Calendar1
                        className="h-5 w-5"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Years
                      </span>
                    </div>
                  </label>
                </div>
                <p
                  className="mt-2 font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Choose how to display remaining time
                </p>
              </div>

              {/* Soldier Mode */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Soldier Mode
                </h3>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSoldier}
                      onChange={(e) => setIsSoldier(e.target.checked)}
                      className="theme-checkbox h-4 w-4 rounded"
                    />
                    <div>
                      <span
                        className="block text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        I&apos;m a soldier
                      </span>
                      <span
                        className="font-mono text-xs"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        Show motivational messages for 21-month military service
                      </span>
                    </div>
                  </label>

                  {/* Explicit Words - Only show when soldier mode is active */}
                  {isSoldier && (
                    <label className="ml-6 flex cursor-pointer items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={explicitWords}
                        onChange={(e) => setExplicitWords(e.target.checked)}
                        className="theme-checkbox h-4 w-4 rounded"
                      />
                      <div>
                        <span
                          className="block text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Explicit words
                        </span>
                        <span
                          className="font-mono text-xs"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          Show uncensored motivational phrases
                        </span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Reset Button */}
              <div
                className="border-t pt-4"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <button
                  onClick={resetGeneralSettings}
                  className="theme-button-danger w-full rounded-lg border px-4 py-3 font-medium transition-all duration-300 hover:scale-105"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Joke Settings Section */}
        <div className="mb-6" dir="ltr">
          <div className="liquid-glass overflow-hidden">
            <div className="space-y-6 p-6">
              {/* Section Header */}
              <div
                className="border-b pb-4 text-center"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <h2
                  className="mb-2 flex items-center justify-center gap-2 text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Drama className="h-5 w-5" /> Joke Settings
                </h2>
                <p
                  className="font-mono text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Customize your joke preferences
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_CATEGORIES.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={settings.categories.includes(category)}
                        onChange={(e) =>
                          handleCategoryChange(category, e.target.checked)
                        }
                        className="theme-checkbox h-4 w-4 rounded"
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Language
                </h3>
                <div className="relative">
                  <select
                    value={settings.lang}
                    onChange={(e) => updateSettings({ lang: e.target.value })}
                    className="theme-input w-full cursor-pointer appearance-none rounded-lg border px-3 py-2 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-gray-800"
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron icon */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg
                      className="h-4 w-4"
                      style={{ color: 'var(--text-tertiary)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Joke Type */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Joke Type
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'any', label: 'Any Type' },
                    { value: 'single', label: 'Single (One-liner)' },
                    { value: 'twopart', label: 'Two Part (Setup & Delivery)' },
                  ].map((type) => (
                    <label
                      key={type.value}
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name="jokeType"
                        value={type.value}
                        checked={settings.type === type.value}
                        onChange={(e) =>
                          updateSettings({
                            type: e.target.value as
                              | 'single'
                              | 'twopart'
                              | 'any',
                          })
                        }
                        className="theme-checkbox h-4 w-4"
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Safe Mode */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Safe Mode
                </h3>
                <label className="flex cursor-pointer items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.safeMode}
                    onChange={(e) =>
                      updateSettings({ safeMode: e.target.checked })
                    }
                    className="theme-checkbox h-4 w-4 rounded"
                  />
                  <div>
                    <span
                      className="block text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Enable Safe Mode
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      Only show jokes safe for everyone
                    </span>
                  </div>
                </label>
              </div>

              {/* Blacklist Flags */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Content Filters
                </h3>
                <p
                  className="mb-3 font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Block jokes with these content types:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {AVAILABLE_FLAGS.map((flag) => (
                    <label
                      key={flag}
                      className="flex cursor-pointer items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={settings.blacklistFlags.includes(flag)}
                        onChange={(e) =>
                          handleFlagChange(flag, e.target.checked)
                        }
                        className="theme-checkbox h-4 w-4 rounded"
                      />
                      <span
                        className="text-sm capitalize"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {flag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Jokes per Request
                </h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.amount}
                    onChange={(e) =>
                      updateSettings({ amount: parseInt(e.target.value) })
                    }
                    className="theme-range h-2 flex-1 cursor-pointer appearance-none rounded-lg"
                  />
                  <span
                    className="w-8 text-center font-mono"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {settings.amount}
                  </span>
                </div>
                <p
                  className="mt-1 font-mono text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Number of jokes to fetch at once (1-10)
                </p>
              </div>

              {/* Reset Button */}
              <div
                className="border-t pt-4"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <button
                  onClick={resetSettings}
                  className="theme-button-danger w-full rounded-lg border px-4 py-3 font-medium transition-all duration-300 hover:scale-105"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
