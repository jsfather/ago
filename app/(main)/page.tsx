'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Icon from 'react-multi-date-picker/components/icon';
import DateSelectionModal from '@/app/components/DateSelectionModal';
import ProgressBar from '@/app/components/ProgressBar';
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#081827]">
      {/* Enhanced liquid background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081827]/95 via-[#081827]/90 to-[#081827]/95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(99,102,241,0.06),transparent_50%)]"></div>

      {/* Animated floating orbs */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl md:h-96 md:w-96"></div>
      <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 blur-3xl delay-1000 md:h-80 md:w-80"></div>

      {/* Progress bar section - exactly 200px height */}
      {dateRange && dateRange.length >= 2 && (
        <div className="relative z-10 h-[200px] flex-shrink-0">
          <ProgressBar dateRange={dateRange} />
        </div>
      )}

      {/* Main content area - centers content in remaining space */}
      <div
        className={`relative z-10 flex items-center justify-center px-4 ${
          dateRange && dateRange.length >= 2
            ? 'h-[calc(100vh-200px)] overflow-y-auto' // When progress bar is shown, this takes remaining height (800px on 1000px screen)
            : 'h-screen overflow-y-auto' // When progress bar is hidden, this takes full screen (1000px)
        }`}
      >
        <DateSelectionModal
          isOpen={isFirstVisit}
          onDateSelect={handleModalDateSelect}
          initialDate={startDate}
        />

        {/* Liquid glass main content container */}
        <div className="mx-auto w-full max-w-md text-center">
          {/* Revolutionary liquid glass container - only show when currentDate exists */}
          {currentDate && (
            <div className="group relative">
              {/* Contained glow effects - no negative margins to prevent clipping */}
              <div className="absolute inset-0 scale-105 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-cyan-500/20 opacity-40 blur-lg transition-all duration-700 group-hover:opacity-65 md:rounded-[3rem] md:blur-xl"></div>

              {/* Main liquid glass container with contained shadows */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.15] bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] shadow-[0_8px_25px_-4px_rgba(0,0,0,0.3),0_4px_15px_-2px_rgba(59,130,246,0.2)] backdrop-blur-3xl md:rounded-[3rem] md:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.4),0_6px_20px_-3px_rgba(59,130,246,0.25)]">
                {/* Animated liquid overlay */}
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03]"></div>

                {/* Inner border glow */}
                <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-gradient-to-br from-white/[0.08] to-transparent md:rounded-[calc(3rem-1px)]"></div>

                {/* Content container */}
                <div className="relative space-y-6 p-6 md:space-y-8 md:p-12">
                  {currentDate &&
                    timeUnits.map(
                      (unit, index) =>
                        unit.show && (
                          <div
                            key={index}
                            className="group/item flex flex-col items-center"
                          >
                            {/* Liquid glass number container - optimized for mobile */}
                            <div className="relative mb-3">
                              {/* Number background glow */}
                              <div className="absolute inset-0 scale-110 rounded-xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 opacity-60 blur-lg transition-all duration-500 group-hover/item:scale-125 group-hover/item:opacity-100 md:rounded-2xl md:blur-xl"></div>

                              {/* Liquid glass number background */}
                              <div className="absolute inset-0 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl md:rounded-2xl"></div>

                              {/* Number text with liquid effect - responsive sizing */}
                              <div className="relative px-4 py-2 font-mono text-4xl font-black tracking-tight md:px-6 md:py-3 md:text-6xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent opacity-50 blur-sm"></div>
                                <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent drop-shadow-2xl">
                                  {unit.value}
                                </div>
                              </div>
                            </div>

                            {/* Liquid glass label - responsive sizing */}
                            <div className="relative">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm md:rounded-xl"></div>
                              <div className="relative px-3 py-1.5 text-lg font-bold tracking-wide text-white/90 transition-colors duration-300 group-hover/item:text-white md:px-4 md:py-2 md:text-xl">
                                {unit.label}
                              </div>
                            </div>
                          </div>
                        )
                    )}

                  {currentDate && timeUnits.every((unit) => !unit.show) && (
                    <div className="group/empty relative">
                      {/* Contained empty state glow - no negative margins */}
                      <div className="absolute inset-0 scale-105 rounded-xl bg-gradient-to-r from-gray-500/10 to-gray-400/10 opacity-40 blur-md transition-all duration-500 group-hover/empty:from-blue-500/15 group-hover/empty:to-purple-500/15 group-hover/empty:opacity-60 md:rounded-2xl md:blur-lg"></div>
                      <div className="relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent px-6 py-4 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.25)] backdrop-blur-xl md:rounded-2xl md:px-8 md:py-6 md:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)]">
                        <div className="text-xl font-bold text-white/70 transition-colors duration-300 group-hover/empty:text-white/90 md:text-2xl">
                          هنوز زمانی نگذشته
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating date picker button */}
      {!isFirstVisit && (
        <div className="fixed bottom-4 left-4 z-50 md:bottom-8 md:left-8">
          {/* Liquid glass floating action button */}
          <div className="group relative">
            {/* Outer glow with liquid effect */}
            <div className="absolute -inset-3 animate-pulse rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100 md:-inset-4 md:blur-2xl"></div>

            {/* Liquid glass button container */}
            <div className="relative">
              {/* Animated background orb */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-cyan-500/20 blur-lg md:blur-xl"></div>

              {/* Main button with liquid glass effect */}
              <div className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/[0.2] bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 group-hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] md:h-20 md:w-20">
                {/* Inner border glow */}
                <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/[0.1] to-transparent"></div>

                {/* Liquid overlay animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <DatePicker
                  value={dateRange || undefined}
                  onChange={handleDatePickerChange}
                  calendar={persian}
                  locale={persian_fa}
                  range
                  className="bg-dark"
                  mapDays={({ date, today, selectedDate }) => {
                    const isToday =
                      date.day === today.day &&
                      date.month === today.month &&
                      date.year === today.year;
                    const isPast = date.toDate() < today.toDate();
                    const isFuture = date.toDate() > today.toDate();

                    // If selecting first date (start date) and it's in the future, disable it
                    if (
                      !Array.isArray(selectedDate) ||
                      selectedDate.length === 0
                    ) {
                      if (isFuture) {
                        return {
                          disabled: true,
                          style: { color: '#6b7280' },
                        };
                      }
                    }

                    // If selecting second date (end date) and it's today or past, disable it
                    if (
                      Array.isArray(selectedDate) &&
                      selectedDate.length === 1
                    ) {
                      if (isToday || isPast) {
                        return {
                          disabled: true,
                          style: { color: '#6b7280' },
                        };
                      }
                    }

                    return {};
                  }}
                  render={
                    <Icon
                      width={32}
                      height={32}
                      color="#ffffff"
                      className="relative z-10 drop-shadow-lg md:h-10 md:w-10"
                    />
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  }}
                  calendarPosition="bottom-left"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
