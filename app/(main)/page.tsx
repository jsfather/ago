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
  const { 
    dateRange, 
    startDate, 
    isFirstVisit, 
    saveDateRange, 
    updateStartDate 
  } = useStoredDateRange();
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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:32px_32px] pointer-events-none"></div>
      
      <ProgressBar dateRange={dateRange} />

      <DateSelectionModal
        isOpen={isFirstVisit}
        onDateSelect={handleModalDateSelect}
        initialDate={startDate}
      />

      {/* Main content container with enhanced styling */}
      <div className="relative z-10 space-y-12 text-center px-8">
        {/* Backdrop blur container for main content */}
        <div className="relative rounded-3xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl p-12">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700/10 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="relative space-y-8">
            {currentDate &&
              timeUnits.map(
                (unit, index) =>
                  unit.show && (
                    <div key={index} className="flex flex-col items-center group">
                      {/* Enhanced number display with glow effect */}
                      <div className="relative mb-4">
                        <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-gray-400/30 to-gray-300/30 rounded-2xl"></div>
                        <div className="relative font-mono text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-300 drop-shadow-2xl">
                          {unit.value}
                        </div>
                      </div>
                      {/* Enhanced label with subtle animation */}
                      <div className="text-4xl font-bold text-gray-300 tracking-wide group-hover:text-gray-200 transition-colors duration-300">
                        {unit.label}
                      </div>
                    </div>
                  )
              )}

            {currentDate && timeUnits.every((unit) => !unit.show) && (
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-xl"></div>
                <div className="relative text-5xl font-bold text-gray-400 py-8">
                  هنوز زمانی نگذشته
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!isFirstVisit && (
        <div className="fixed bottom-6 left-6 z-50">
          {/* Enhanced floating action button with glassmorphism */}
          <div className="relative group">
            {/* Glow effect background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Main button container */}
            <div className="relative flex cursor-pointer items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 p-5 shadow-2xl transition-all duration-300 hover:bg-gray-700/80 hover:scale-110 hover:shadow-gray-900/50 active:scale-95">
              <DatePicker
                value={dateRange || undefined}
                onChange={handleDatePickerChange}
                calendar={persian}
                locale={persian_fa}
                range
                className="bg-dark"
                mapDays={({ date, today, selectedDate }) => {
                  const isToday = date.day === today.day && 
                                date.month === today.month && 
                                date.year === today.year;
                  const isPast = date.toDate() < today.toDate();
                  const isFuture = date.toDate() > today.toDate();
                  
                  // If selecting first date (start date) and it's in the future, disable it
                  if (!Array.isArray(selectedDate) || selectedDate.length === 0) {
                    if (isFuture) {
                      return {
                        disabled: true,
                        style: { color: '#6b7280' }
                      };
                    }
                  }
                  
                  // If selecting second date (end date) and it's today or past, disable it
                  if (Array.isArray(selectedDate) && selectedDate.length === 1) {
                    if (isToday || isPast) {
                      return {
                        disabled: true,
                        style: { color: '#6b7280' }
                      };
                    }
                  }
                  
                  return {};
                }}
                render={<Icon width={36} height={36} color="#f3f4f6" />}
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
      )}
    </div>
  );
}
