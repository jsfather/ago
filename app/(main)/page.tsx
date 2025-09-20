'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Icon from 'react-multi-date-picker/components/icon';
import DateSelectionModal from '@/app/components/DateSelectionModal';
import ProgressBar from '@/app/components/ProgressBar';
import JokeComponent from '@/app/components/JokeComponent';
import { useStoredDateRange } from '@/app/hooks/useStoredDateRange';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

export default function Home() {
  const { dateRange, startDate, isFirstVisit, saveDateRange, updateStartDate } =
    useStoredDateRange();
  const [currentDate, setCurrentDate] = useState<DateObject | null>(null);

  // Update currentDate when startDate changes
  useEffect(() => {
    if (startDate) {
      setCurrentDate(startDate);
    }
  }, [startDate]);

  const handleModalDateSelect = (date: DateObject) => {
    updateStartDate(date);
    setCurrentDate(date);
  };

  const handleDatePickerChange = (newVal: DateObject | DateObject[] | null) => {
    if (newVal) {
      if (Array.isArray(newVal)) {
        const success = saveDateRange(newVal);
        if (success) {
          // Always use the first date (start date) for ago calculations
          if (newVal.length > 0) {
            setCurrentDate(newVal[0]);
          }
        }
      } else {
        // Single date selected, convert to range
        const success = saveDateRange([newVal]);
        if (success) {
          setCurrentDate(newVal);
        }
      }
    }
  };

  // Only calculate ago if we have a valid currentDate
  const ago = currentDate
    ? getAgoFromDate(currentDate.toDate(), { live: true })
    : { years: 0, months: 0, days: 0 };

  const timeUnits = [
    { value: ago.years, label: 'سال', show: ago.years > 0 },
    { value: ago.months, label: 'ماه', show: ago.months > 0 },
    { value: ago.days, label: 'روز', show: ago.days > 0 },
  ];

  return (
    <div
      className="min-h-screen overflow-y-auto px-4"
      style={{ backgroundColor: '#081827' }}
    >
      <div className="flex flex-col py-6">
        {/* Progress bar section - at the top */}
        {dateRange && dateRange.length >= 2 && (
          <div className="animate-bloop-in mb-8">
            <div className="mx-auto w-full max-w-md">
              <ProgressBar dateRange={dateRange} />
            </div>
          </div>
        )}

        {/* Date display section */}
        {currentDate && (
          <div className="animate-bloop-bounce mb-8">
            <div className="mx-auto w-full max-w-md">
              <div className="liquid-glass overflow-hidden">
                <div className="relative space-y-6 p-6 md:space-y-8 md:p-12">
                  {currentDate &&
                    timeUnits.map(
                      (unit, index) =>
                        unit.show && (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            {/* Liquid glass number container - optimized for mobile */}
                            <div className="relative mb-3">
                              {/* Liquid glass number background */}
                              <div className="liquid-glass-subtle">
                                {/* Number text with liquid effect - responsive sizing */}
                                <div className="relative px-4 py-2 font-mono text-4xl font-black tracking-tight md:px-6 md:py-3 md:text-6xl">
                                  <div className="relative text-white/95">
                                    {unit.value}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Liquid glass label - responsive sizing */}
                            <div className="liquid-glass-subtle px-3 py-1.5 md:px-4 md:py-2">
                              <div className="text-lg font-bold tracking-wide text-white/70 md:text-xl">
                                {unit.label}
                              </div>
                            </div>
                          </div>
                        )
                    )}

                  {currentDate && timeUnits.every((unit) => !unit.show) && (
                    <div className="relative">
                      <div className="liquid-glass-subtle px-6 py-4 md:px-8 md:py-6">
                        <div className="text-xl font-bold text-white/70 md:text-2xl">
                          هنوز زمانی نگذشته
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Joke Component section */}
        {currentDate && (
          <div className="animate-bloop-in mb-8">
            <div className="mx-auto w-full max-w-md">
              <JokeComponent />
            </div>
          </div>
        )}
      </div>

      {/* Date Selection Modal */}
      <DateSelectionModal
        isOpen={isFirstVisit}
        onDateSelect={handleModalDateSelect}
        initialDate={startDate}
      />

      {/* Floating date picker button */}
      {!isFirstVisit && (
        <div className="animate-bloop-bounce fixed bottom-4 left-4 z-50 md:bottom-8 md:left-8">
          {/* Liquid glass floating action button */}
          <div className="relative">
            {/* Main button with liquid glass effect */}
            <div className="liquid-glass flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-105 md:h-20 md:w-20">
              <DatePicker
                value={dateRange || undefined}
                onChange={handleDatePickerChange}
                calendar={persian}
                locale={persian_fa}
                range
                className="liquid-calendar"
                mapDays={({ date, today }) => {
                  const isToday =
                    date.day === today.day &&
                    date.month === today.month &&
                    date.year === today.year;
                  const isPast = date.toDate() < today.toDate();
                  const isFuture = date.toDate() > today.toDate();

                  // Determine if this is for start or end date selection
                  const isSelectingEnd = dateRange && dateRange.length === 1;

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
                render={(value, openCalendar) => (
                  <Icon
                    onClick={openCalendar}
                    className="cursor-pointer text-white/90 transition-all duration-300 hover:text-white md:size-6"
                  />
                )}
                style={{
                  background: '#081827',
                  border: 'none',
                  boxShadow: 'none',
                }}
                calendarPosition="bottom-left"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
