'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStoredDateRange } from '../hooks/useStoredDateRange';
import { CalendarBlank, X } from '@phosphor-icons/react';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateInputGroup, {
  type DateFields,
  emptyFields,
  dateObjectToFields,
  fieldsToDateObject,
} from './DateInputGroup';

export default function CalendarPage() {
  const { dateRange, saveDateRange } = useStoredDateRange();
  const [startFields, setStartFields] = useState<DateFields>(emptyFields);
  const [endFields, setEndFields] = useState<DateFields>(emptyFields);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  // Populate fields from stored date range on mount
  useEffect(() => {
    if (dateRange && dateRange.length > 0) {
      setStartFields(dateObjectToFields(dateRange[0]));
      if (dateRange.length > 1) {
        setEndFields(dateObjectToFields(dateRange[1]));
      }
    }
  }, [dateRange]);

  const handleStartChange = useCallback(
    (fields: DateFields) => {
      setStartFields(fields);
      setStartError('');

      // Only save when all fields are filled
      if (!fields.year || !fields.month || !fields.day) return;

      const dateObj = fieldsToDateObject(fields);
      if (!dateObj) {
        setStartError('تاریخ نامعتبر');
        return;
      }

      // Start date cannot be in the future
      const today = new DateObject({
        date: new Date(),
        calendar: persian,
        locale: persian_fa,
      });
      const jalaliInput = new DateObject({
        date: dateObj.toDate(),
        calendar: persian,
        locale: persian_fa,
      });
      if (jalaliInput.toDate() > today.toDate()) {
        setStartError('تاریخ شروع نمی‌تونه از امروز بزرگتر باشه');
        return;
      }

      const endDateObj = fieldsToDateObject(endFields);
      const newRange = endDateObj ? [dateObj, endDateObj] : [dateObj];
      saveDateRange(newRange);
    },
    [endFields, saveDateRange]
  );

  const handleEndChange = useCallback(
    (fields: DateFields) => {
      setEndFields(fields);
      setEndError('');

      // Only save when all fields are filled
      if (!fields.year || !fields.month || !fields.day) return;

      const dateObj = fieldsToDateObject(fields);
      if (!dateObj) {
        setEndError('تاریخ نامعتبر');
        return;
      }

      const startDateObj = fieldsToDateObject(startFields);
      if (startDateObj) {
        saveDateRange([startDateObj, dateObj]);
      }
    },
    [startFields, saveDateRange]
  );

  const clearEndDate = useCallback(() => {
    setEndFields(emptyFields);
    setEndError('');
    const startDateObj = fieldsToDateObject(startFields);
    if (startDateObj) {
      saveDateRange([startDateObj]);
    }
  }, [startFields, saveDateRange]);

  const hasEndDate =
    endFields.year !== '' || endFields.month !== '' || endFields.day !== '';

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center pb-20"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div className="mx-auto w-full max-w-md px-4">
        <div className="liquid-glass overflow-hidden">
          <div className="relative space-y-6 p-6">
            {/* Header */}
            <div
              className="border-b pb-4 text-center"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <h2
                className="mb-1 flex items-center justify-center gap-2 text-xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                <CalendarBlank size={22} weight="fill" />
                انتخاب بازه زمانی
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                تاریخ شروع و پایان رو مشخص کن
              </p>
            </div>

            {/* Start Date */}
            <div className="space-y-2" dir="rtl">
              <label
                className="block text-sm font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                تاریخ شروع
              </label>
              <DateInputGroup
                fields={startFields}
                onChange={handleStartChange}
              />
              {startError && (
                <p
                  className="text-xs font-medium"
                  style={{ color: 'var(--button-danger-text)' }}
                >
                  {startError}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2" dir="rtl">
              <div className="flex items-center justify-between">
                <label
                  className="block text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  تاریخ پایان
                  <span
                    className="mr-1 text-xs font-normal"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    (اختیاری)
                  </span>
                </label>
                {hasEndDate && (
                  <button
                    onClick={clearEndDate}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      color: 'var(--button-danger-text)',
                      backgroundColor: 'var(--button-danger-bg)',
                      borderColor: 'var(--button-danger-border)',
                      borderWidth: '1px',
                    }}
                    aria-label="پاک کردن تاریخ پایان"
                  >
                    <X size={12} weight="bold" />
                    پاک کردن
                  </button>
                )}
              </div>
              <DateInputGroup
                fields={endFields}
                onChange={handleEndChange}
                autoFocus={false}
              />
              {endError && (
                <p
                  className="text-xs font-medium"
                  style={{ color: 'var(--button-danger-text)' }}
                >
                  {endError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
