'use client';

import { useJokeSettings } from '../hooks/useJokeSettings';

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

  if (!isLoaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4 pt-6 pb-20"
        style={{ backgroundColor: '#081827' }}
      >
        <div className="liquid-glass px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/90"></div>
            <span className="text-white/80">Loading settings...</span>
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

  return (
    <div
      className="min-h-screen px-4 pt-6 pb-20"
      style={{ backgroundColor: '#081827' }}
    >
      <div className="mx-auto max-w-md">
        {/* Joke Settings Section */}
        <div className="mb-6" dir="ltr">
          <div className="liquid-glass overflow-hidden">
            <div className="space-y-6 p-6">
              {/* Section Header */}
              <div className="border-b border-white/10 pb-4 text-center">
                <h2 className="mb-2 text-xl font-bold text-white/95">
                  🎭 Joke Settings
                </h2>
                <p className="font-mono text-sm text-white/70">
                  Customize your joke preferences
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
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
                        className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-white/80">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
                  Language
                </h3>
                <select
                  value={settings.lang}
                  onChange={(e) => updateSettings({ lang: e.target.value })}
                  className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white/90 focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
              </div>

              {/* Joke Type */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
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
                          updateSettings({ type: e.target.value as any })
                        }
                        className="h-4 w-4 border-white/30 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-white/80">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Safe Mode */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
                  Safe Mode
                </h3>
                <label className="flex cursor-pointer items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.safeMode}
                    onChange={(e) =>
                      updateSettings({ safeMode: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block text-sm text-white/80">
                      Enable Safe Mode
                    </span>
                    <span className="font-mono text-xs text-white/50">
                      Only show jokes safe for everyone
                    </span>
                  </div>
                </label>
              </div>

              {/* Blacklist Flags */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
                  Content Filters
                </h3>
                <p className="mb-3 font-mono text-xs text-white/60">
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
                        className="h-4 w-4 rounded border-white/30 bg-white/10 text-red-600 focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-sm text-white/80 capitalize">
                        {flag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-white/90">
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
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/20"
                  />
                  <span className="w-8 text-center font-mono text-white/80">
                    {settings.amount}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-white/50">
                  Number of jokes to fetch at once (1-10)
                </p>
              </div>

              {/* Reset Button */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={resetSettings}
                  className="w-full rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 font-medium text-red-300 transition-all duration-300 hover:scale-105 hover:bg-red-500/30"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Settings Placeholder */}
        <div className="liquid-glass overflow-hidden">
          <div className="p-8 text-center">
            <div className="mb-4 text-6xl">⚙️</div>
            <div className="text-lg font-medium text-white/70">
              More Settings
            </div>
            <div className="mt-2 font-mono text-sm text-white/50">
              Additional settings will be added in future updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
