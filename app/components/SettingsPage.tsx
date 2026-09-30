'use client';

import {
  Moon,
  Sun,
  Laptop,
  SlidersHorizontal,
  Smile,
  CalendarDays,
  CalendarRange,
  RotateCcw,
} from 'lucide-react';
import { useJokeSettings, type JokeSettings } from '../hooks/useJokeSettings';
import { useTheme, type Theme } from '../hooks/useTheme';
import { useTimeDisplayFormat } from '../hooks/useTimeDisplayFormat';
import { useSoldierMode } from '../hooks/useSoldierMode';
import PageHeading from './PageHeading';

const categories = [
  'Any',
  'Misc',
  'Programming',
  'Dark',
  'Pun',
  'Spooky',
  'Christmas',
];
const flags = [
  'nsfw',
  'religious',
  'political',
  'racist',
  'sexist',
  'explicit',
];
const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'cs', name: 'Czech' },
];
const themes = [
  { value: 'light', label: 'روشن', icon: Sun },
  { value: 'dark', label: 'تاریک', icon: Moon },
  { value: 'system', label: 'سیستم', icon: Laptop },
] as const;

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, isLoaded } =
    useJokeSettings();
  const { theme, setTheme, isLoaded: themeLoaded } = useTheme();
  const { format, setFormat, isLoaded: formatLoaded } = useTimeDisplayFormat();
  const { isSoldier, setIsSoldier, isLoaded: soldierLoaded } = useSoldierMode();

  const changeCategory = (category: string, checked: boolean) => {
    updateSettings({
      categories: checked
        ? category === 'Any'
          ? ['Any']
          : [...settings.categories.filter((c) => c !== 'Any'), category]
        : settings.categories.filter((c) => c !== category),
    });
  };
  const resetGeneral = () => {
    setTheme('system');
    setFormat('months');
    setIsSoldier(false);
  };

  if (!isLoaded || !themeLoaded || !formatLoaded || !soldierLoaded)
    return (
      <p className="text-secondary py-12" role="status">
        در حال بارگذاری تنظیمات…
      </p>
    );

  return (
    <div className="animate-enter">
      <PageHeading
        eyebrow="به سلیقه تو"
        title="یه فضای شخصی‌تر."
        description="ظاهر، نمایش زمان و حال‌وهوای جوک‌ها رو خودت انتخاب کن."
      />
      <div className="settings-grid">
        <section className="surface-card settings-section">
          <header>
            <h2>
              <SlidersHorizontal size={19} />
              تنظیمات عمومی
            </h2>
            <p>جزئیات کوچیک، تجربه بهتر.</p>
          </header>
          <fieldset className="setting-group">
            <legend>ظاهر برنامه</legend>
            <div className="choice-grid">
              {themes.map(({ value, label, icon: Icon }) => (
                <label key={value} className="choice">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={theme === value}
                    onChange={() => setTheme(value as Theme)}
                  />
                  <Icon size={23} strokeWidth={1.5} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <p className="setting-hint">
              حالت سیستم با تنظیمات دستگاهت هماهنگ می‌شه.
            </p>
          </fieldset>
          <fieldset className="setting-group">
            <legend>نمایش زمان باقی‌مونده</legend>
            <div
              className="choice-grid"
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              {[
                { value: 'days', label: 'به روز', icon: CalendarDays },
                { value: 'months', label: 'به ماه', icon: CalendarRange },
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="choice">
                  <input
                    type="radio"
                    name="timeFormat"
                    checked={format === value}
                    onChange={() => setFormat(value as 'days' | 'months')}
                  />
                  <Icon size={21} strokeWidth={1.5} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="setting-group">
            <legend>حالت سربازی</legend>
            <label className="check-label">
              <input
                type="checkbox"
                checked={isSoldier}
                onChange={(e) => setIsSoldier(e.target.checked)}
                className="theme-checkbox"
              />
              سربازم
            </label>
            <p className="setting-hint">
              درجه و پیام‌های مخصوص مسیر سربازی رو نمایش بده.
            </p>
          </fieldset>
          <button onClick={resetGeneral} className="button-secondary w-full">
            <RotateCcw size={15} />
            بازنشانی تنظیمات عمومی
          </button>
        </section>
        <section className="surface-card settings-section">
          <header>
            <h2>
              <Smile size={19} />
              تنظیمات جوک
            </h2>
            <p>برای وقت‌هایی که یه لبخند لازم داری.</p>
          </header>
          <fieldset className="setting-group">
            <legend>موضوع‌ها</legend>
            <div className="grid grid-cols-2 gap-x-3" dir="ltr">
              {categories.map((category) => (
                <label key={category} className="check-label">
                  <input
                    type="checkbox"
                    checked={settings.categories.includes(category)}
                    onChange={(e) => changeCategory(category, e.target.checked)}
                    className="theme-checkbox"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="setting-group">
            <label className="setting-label" htmlFor="joke-language">
              زبان جوک
            </label>
            <select
              id="joke-language"
              value={settings.lang}
              onChange={(e) => updateSettings({ lang: e.target.value })}
              className="theme-input"
              dir="ltr"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <fieldset className="setting-group">
            <legend>نوع جوک</legend>
            {[
              { value: 'any', label: 'فرقی نداره' },
              { value: 'single', label: 'تک‌قسمتی' },
              { value: 'twopart', label: 'دوقسمتی' },
            ].map((type) => (
              <label key={type.value} className="check-label">
                <input
                  type="radio"
                  name="jokeType"
                  checked={settings.type === type.value}
                  onChange={() =>
                    updateSettings({ type: type.value as JokeSettings['type'] })
                  }
                  className="theme-checkbox"
                />
                {type.label}
              </label>
            ))}
          </fieldset>
          <fieldset className="setting-group">
            <legend>محتوای مناسب</legend>
            <label className="check-label">
              <input
                type="checkbox"
                checked={settings.safeMode}
                onChange={(e) => updateSettings({ safeMode: e.target.checked })}
                className="theme-checkbox"
              />
              فقط جوک‌های مناسب همه
            </label>
            <p className="setting-hint">
              موضوع‌هایی که دوست نداری ببینی رو انتخاب کن:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-3" dir="ltr">
              {flags.map((flag) => (
                <label key={flag} className="check-label">
                  <input
                    type="checkbox"
                    checked={settings.blacklistFlags.includes(flag)}
                    onChange={(e) =>
                      updateSettings({
                        blacklistFlags: e.target.checked
                          ? [...settings.blacklistFlags, flag]
                          : settings.blacklistFlags.filter((f) => f !== flag),
                      })
                    }
                    className="theme-checkbox"
                  />
                  {flag}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="setting-group">
            <label className="setting-label" htmlFor="joke-amount">
              تعداد جوک در هر درخواست
            </label>
            <div className="flex items-center gap-4">
              <input
                id="joke-amount"
                type="range"
                min="1"
                max="10"
                value={settings.amount}
                onChange={(e) =>
                  updateSettings({ amount: Number(e.target.value) })
                }
                className="theme-range"
              />
              <output htmlFor="joke-amount" className="badge">
                {settings.amount.toLocaleString('fa-IR')}
              </output>
            </div>
          </div>
          <button onClick={resetSettings} className="button-secondary w-full">
            <RotateCcw size={15} />
            بازنشانی تنظیمات جوک
          </button>
        </section>
      </div>
    </div>
  );
}
