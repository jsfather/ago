'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import { DateObject } from 'react-multi-date-picker';
import DateSelectionModal from '@/app/components/DateSelectionModal';
import ProgressBar from '@/app/components/ProgressBar';
import JokeComponent from '@/app/components/JokeComponent';
import { useStoredDateRange } from '@/app/hooks/useStoredDateRange';

export default function Home() {
  const { dateRange, startDate, isFirstVisit, updateStartDate } =
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
      className="min-h-screen overflow-y-auto px-4 pb-20"
      style={{ backgroundColor: 'var(--primary-bg)' }}
    >
      <div className="flex flex-col py-4">
        {/* Progress bar section - at the top */}
        {dateRange && dateRange.length >= 2 && (
          <div className="animate-bloop-in mb-4">
            <div className="mx-auto w-full max-w-md">
              <ProgressBar dateRange={dateRange} />
            </div>
          </div>
        )}

        {/* Date display section */}
        {currentDate && (
          <div className="animate-bloop-bounce mb-4">
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
                                  <div
                                    className="relative"
                                    style={{ color: 'var(--text-primary)' }}
                                  >
                                    {unit.value}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Liquid glass label - responsive sizing */}
                            <div className="liquid-glass-subtle px-3 py-1.5 md:px-4 md:py-2">
                              <div
                                className="text-lg font-bold tracking-wide md:text-xl"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                {unit.label}
                              </div>
                            </div>
                          </div>
                        )
                    )}

                  {currentDate && timeUnits.every((unit) => !unit.show) && (
                    <div className="relative">
                      <div className="liquid-glass-subtle px-6 py-4 md:px-8 md:py-6">
                        <div
                          className="text-center text-xl font-bold md:text-2xl"
                          style={{ color: 'var(--text-secondary)' }}
                        >
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
          <div className="animate-bloop-in mb-4">
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
    </div>
  );
}
