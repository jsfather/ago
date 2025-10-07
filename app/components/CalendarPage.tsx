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
      style={{ backgroundColor: '#081827' }}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <Calendar
          value={selectedDates || undefined}
          onChange={handleDateChange}
          calendar={persian}
          locale={persian_fa}
          range
          numberOfMonths={1}
          className="h-full w-full"
          mapDays={({ date, today }: any) => {
            const isToday =
              date.day === today.day &&
              date.month === today.month &&
              date.year === today.year;
            const isPast = date.toDate() < today.toDate();
            const isFuture = date.toDate() > today.toDate();

            // Determine if this is for start or end date selection
            const isSelectingEnd = selectedDates && selectedDates.length === 1;

            if (isToday) {
              return {
                disabled: false,
                style: {
                  color: 'white',
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                  border: '2px solid rgba(59, 130, 246, 0.8)',
                  fontWeight: 'bold',
                },
              };
            }

            // Rules for start date selection (first date)
            if (!isSelectingEnd) {
              if (isPast) {
                // Start date can be any past date
                return {
                  disabled: false,
                  style: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                };
              }

              if (isFuture) {
                // Start date cannot be in the future
                return {
                  disabled: true,
                  style: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'transparent',
                  },
                };
              }
            } else {
              // Rules for end date selection (second date)
              if (isPast) {
                // End date cannot be before today
                return {
                  disabled: true,
                  style: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'transparent',
                  },
                };
              }

              if (isFuture) {
                // End date can be any future date
                return {
                  disabled: false,
                  style: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                };
              }
            }

            return {
              disabled: false,
              style: {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            };
          }}
        />
      </div>
    </div>
  );
}
