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
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900">
      <ProgressBar dateRange={dateRange} />

      <DateSelectionModal
        isOpen={isFirstVisit}
        onDateSelect={handleModalDateSelect}
        initialDate={startDate}
      />

      <div className="space-y-8 text-center">
        {currentDate &&
          timeUnits.map(
            (unit, index) =>
              unit.show && (
                <div key={index} className="flex flex-col items-center">
                  <div className="mb-2 font-mono text-8xl font-bold tracking-wider text-white">
                    {unit.value}
                  </div>
                  <div className="text-3xl font-medium text-gray-300">
                    {unit.label}
                  </div>
                </div>
              )
          )}

        {currentDate && timeUnits.every((unit) => !unit.show) && (
          <div className="text-4xl text-gray-400">هنوز زمانی نگذشته</div>
        )}
      </div>
      {!isFirstVisit && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray-800 p-4 shadow-lg transition-colors hover:bg-gray-700 focus:bg-gray-700">
            <DatePicker
              value={dateRange || undefined}
              onChange={handleDatePickerChange}
              calendar={persian}
              locale={persian_fa}
              range
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
                      style: { color: '#ccc' }
                    };
                  }
                }
                
                // If selecting second date (end date) and it's today or past, disable it
                if (Array.isArray(selectedDate) && selectedDate.length === 1) {
                  if (isToday || isPast) {
                    return {
                      disabled: true,
                      style: { color: '#ccc' }
                    };
                  }
                }
                
                return {};
              }}
              render={<Icon width={32} height={32} color="white" />}
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
