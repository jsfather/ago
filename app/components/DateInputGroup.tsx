'use client';

import { useRef, useCallback, useEffect } from 'react';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

export interface DateFields {
  year: string;
  month: string;
  day: string;
}

export const emptyFields: DateFields = { year: '', month: '', day: '' };

/** Map of Farsi digits (۰-۹) to Latin digits (0-9) */
const farsiToLatinMap: Record<string, string> = {
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

/** Convert Farsi digits to Latin digits, then strip any non-digit characters */
function normalizeFarsiDigits(value: string): string {
  return value
    .split('')
    .map((ch) => farsiToLatinMap[ch] ?? ch)
    .join('')
    .replace(/\D/g, '');
}

/** Convert a DateObject to Jalali year/month/day strings */
export function dateObjectToFields(d: DateObject): DateFields {
  const jalali = new DateObject({
    date: d.toDate(),
    calendar: persian,
    locale: persian_fa,
  });
  return {
    year: String(jalali.year),
    month: String(jalali.month.number),
    day: String(jalali.day),
  };
}

/** Check if a Jalali year is a leap year */
export function isJalaliLeapYear(year: number): boolean {
  const remainder = year % 33;
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(remainder);
}

/** Get the max day for a given Jalali month (1-12) and year */
export function getMaxDayForMonth(month: number, year?: number): number {
  if (month >= 1 && month <= 6) return 31;
  if (month >= 7 && month <= 11) return 30;
  if (month === 12) {
    if (year && isJalaliLeapYear(year)) return 30;
    return 29;
  }
  return 31;
}

/** Try to build a DateObject from Jalali year/month/day strings. Returns null if invalid. */
export function fieldsToDateObject(f: DateFields): DateObject | null {
  const y = parseInt(f.year, 10);
  const m = parseInt(f.month, 10);
  const d = parseInt(f.day, 10);
  if (!y || !m || !d) return null;
  if (m < 1 || m > 12) return null;
  const maxDay = getMaxDayForMonth(m, y);
  if (d < 1 || d > maxDay) return null;

  try {
    const dateObj = new DateObject({
      year: y,
      month: m,
      day: d,
      calendar: persian,
      locale: persian_fa,
    });
    // Convert to gregorian for storage
    dateObj.convert(undefined, undefined);
    const jsDate = dateObj.toDate();
    if (isNaN(jsDate.getTime())) return null;
    return new DateObject(jsDate);
  } catch {
    return null;
  }
}

interface DateInputGroupProps {
  fields: DateFields;
  onChange: (fields: DateFields) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function DateInputGroup({
  fields,
  onChange,
  disabled,
  autoFocus = true,
}: DateInputGroupProps) {
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      yearRef.current?.focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback(
    (field: keyof DateFields, value: string) => {
      // Normalize Farsi digits to Latin, then strip non-digits
      let digits = normalizeFarsiDigits(value);

      // Clamp month to 1-12
      if (field === 'month' && digits.length >= 2) {
        const num = parseInt(digits, 10);
        if (num > 12) digits = '12';
        if (num < 1 && digits.length === 2) digits = '1';
      }

      // Clamp day based on selected month
      if (field === 'day' && digits.length >= 2) {
        const monthNum = parseInt(fields.month, 10) || 0;
        const yearNum = parseInt(fields.year, 10) || 0;
        const maxDay =
          monthNum >= 1 && monthNum <= 12
            ? getMaxDayForMonth(monthNum, yearNum || undefined)
            : 31;
        const num = parseInt(digits, 10);
        if (num > maxDay) digits = String(maxDay);
        if (num < 1 && digits.length === 2) digits = '1';
      }

      const updated = { ...fields, [field]: digits };

      // Auto-advance to next field (visual order: year → month → day)
      if (field === 'year' && digits.length === 4) {
        monthRef.current?.focus();
        monthRef.current?.select();
      } else if (field === 'month' && digits.length === 2) {
        dayRef.current?.focus();
        dayRef.current?.select();
      }

      onChange(updated);
    },
    [fields, onChange]
  );

  const handleKeyDown = useCallback(
    (field: keyof DateFields, e: React.KeyboardEvent<HTMLInputElement>) => {
      // Navigate between fields with arrow keys (visual order: year / month / day, LTR)
      if (e.key === 'ArrowRight') {
        if (field === 'year') {
          monthRef.current?.focus();
          monthRef.current?.select();
        } else if (field === 'month') {
          dayRef.current?.focus();
          dayRef.current?.select();
        }
      } else if (e.key === 'ArrowLeft') {
        if (field === 'day') {
          monthRef.current?.focus();
          monthRef.current?.select();
        } else if (field === 'month') {
          yearRef.current?.focus();
          yearRef.current?.select();
        }
      } else if (e.key === 'Backspace' && !fields[field]) {
        // Move back on empty backspace
        if (field === 'day') {
          monthRef.current?.focus();
        } else if (field === 'month') {
          yearRef.current?.focus();
        }
      }
    },
    [fields]
  );

  const inputClassName =
    'w-full bg-transparent text-center font-semibold text-base tracking-wider focus:outline-none py-3 transition-all duration-200';

  return (
    <div className="flex items-center gap-2" dir="ltr">
      {/* Year */}
      <div className="liquid-glass-subtle flex-[1.4] overflow-hidden transition-all duration-200 focus-within:border-[var(--glass-border-strong)]">
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="سال"
          value={fields.year}
          onChange={(e) => handleChange('year', e.target.value)}
          onKeyDown={(e) => handleKeyDown('year', e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={inputClassName}
          style={{ color: 'var(--text-primary)' }}
          aria-label="سال"
        />
      </div>

      <span
        className="text-lg font-bold select-none"
        style={{ color: 'var(--text-tertiary)' }}
      >
        /
      </span>

      {/* Month */}
      <div className="liquid-glass-subtle flex-1 overflow-hidden transition-all duration-200 focus-within:border-[var(--glass-border-strong)]">
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          placeholder="ماه"
          value={fields.month}
          onChange={(e) => handleChange('month', e.target.value)}
          onKeyDown={(e) => handleKeyDown('month', e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={inputClassName}
          style={{ color: 'var(--text-primary)' }}
          aria-label="ماه"
        />
      </div>

      <span
        className="text-lg font-bold select-none"
        style={{ color: 'var(--text-tertiary)' }}
      >
        /
      </span>

      {/* Day */}
      <div className="liquid-glass-subtle flex-1 overflow-hidden transition-all duration-200 focus-within:border-[var(--glass-border-strong)]">
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          placeholder="روز"
          value={fields.day}
          onChange={(e) => handleChange('day', e.target.value)}
          onKeyDown={(e) => handleKeyDown('day', e)}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={inputClassName}
          style={{ color: 'var(--text-primary)' }}
          aria-label="روز"
        />
      </div>
    </div>
  );
}
