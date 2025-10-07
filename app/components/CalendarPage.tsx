'use client';

import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
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
      className="min-h-screen px-4 pt-6 pb-20"
      style={{ backgroundColor: '#081827' }}
    >
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="liquid-glass mb-4 px-8 py-4">
            <h1 className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-2xl font-black tracking-wide text-transparent">
              انتخاب تاریخ
            </h1>
          </div>
          <div className="liquid-glass-subtle px-6 py-3">
            <p className="text-sm leading-relaxed text-white/70">
              بازه زمانی مورد نظر خود را انتخاب کنید
            </p>
          </div>
        </div>

        {/* Calendar Container */}
        <div className="liquid-glass overflow-hidden">
          <div className="p-6">
            <DatePicker
              value={selectedDates || undefined}
              onChange={handleDateChange}
              calendar={persian}
              locale={persian_fa}
              range
              numberOfMonths={1}
              className="liquid-calendar"
              arrowClassName="custom-arrow"
              arrow={false}
              onlyMonthPicker={false}
              onlyYearPicker={false}
              style={{
                width: '100%',
                background: 'transparent',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
              containerStyle={{
                width: '100%',
                background: 'transparent',
                backgroundColor: 'transparent',
              }}
              mapDays={({ date, today }) => {
                const isToday =
                  date.day === today.day &&
                  date.month === today.month &&
                  date.year === today.year;
                const isPast = date.toDate() < today.toDate();
                const isFuture = date.toDate() > today.toDate();

                // Determine if this is for start or end date selection
                const isSelectingEnd =
                  selectedDates && selectedDates.length === 1;

                if (isToday) {
                  return {
                    disabled: false,
                    style: {
                      color: 'white',
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      borderRadius: '50%',
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
                        borderRadius: '8px',
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
                        borderRadius: '8px',
                      },
                    };
                  }
                }

                return {
                  disabled: false,
                  style: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  },
                };
              }}
            />
          </div>
        </div>

        {/* Selected Range Display */}
        {selectedDates && selectedDates.length > 0 && (
          <div className="mt-6">
            <div className="liquid-glass-subtle p-4">
              <div className="text-center">
                <div className="mb-2 text-sm font-medium text-white/70">
                  بازه انتخاب شده:
                </div>
                <div className="space-y-1">
                  <div className="text-white/90">
                    از: {selectedDates[0].format('YYYY/MM/DD')}
                  </div>
                  {selectedDates.length > 1 && (
                    <div className="text-white/90">
                      تا: {selectedDates[1].format('YYYY/MM/DD')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
