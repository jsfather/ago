'use client';

import { useState, useEffect } from 'react';
import { Calendar, DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useStoredDateRange } from '../hooks/useStoredDateRange';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

export default function CalendarPage() {
  const { dateRange, saveDateRange } = useStoredDateRange();
  const [selectedDates, setSelectedDates] = useState<DateObject[] | null>(
    dateRange
  );

  useEffect(() => {
    if (dateRange) {
      setSelectedDates(dateRange);
    }
  }, [dateRange]);

  const handleDateChange = (newVal: DateObject | DateObject[] | null) => {
    if (newVal) {
      if (Array.isArray(newVal)) {
        const success = saveDateRange(newVal);
        if (success) {
          setSelectedDates(newVal);
        }
      } else {
        // Single date selected, convert to range
        const success = saveDateRange([newVal]);
        if (success) {
          setSelectedDates([newVal]);
        }
      }
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center pb-16"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div className="flex h-full w-full max-w-md items-center justify-center p-4">
        <Calendar
          value={selectedDates || undefined}
          onChange={handleDateChange}
          calendar={persian}
          locale={persian_fa}
          range
          numberOfMonths={1}
          className="bg-dark h-full w-full"
        />
      </div>
    </div>
  );
}
