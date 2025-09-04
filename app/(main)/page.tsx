'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Icon from 'react-multi-date-picker/components/icon';
import DateSelectionModal from '@/app/components/DateSelectionModal';
import { useStoredStartDate } from '@/app/hooks/useStoredStartDate';

export default function Home() {
  const { startDate, isFirstVisit, saveStartDate } = useStoredStartDate();
  const [currentDate, setCurrentDate] = useState<DateObject | null>(null);

  // Update currentDate when startDate changes
  useEffect(() => {
    if (startDate) {
      setCurrentDate(startDate);
    }
  }, [startDate]);

  const handleModalDateSelect = (date: DateObject) => {
    saveStartDate(date);
    setCurrentDate(date);
  };

  const handleDatePickerChange = (newVal: DateObject | null) => {
    if (newVal) {
      setCurrentDate(newVal);
      saveStartDate(newVal);
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
      <div className="fixed bottom-4 left-4 z-50">
        <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray-800 p-4 shadow-lg transition-colors hover:bg-gray-700 focus:bg-gray-700">
          <DatePicker
            value={currentDate}
            onChange={handleDatePickerChange}
            calendar={persian}
            locale={persian_fa}
            maxDate={new Date()}
            render={<Icon width={32} height={32} color="white" />}
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
