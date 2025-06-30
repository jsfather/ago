'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import Icon from 'react-multi-date-picker/components/icon';

export default function Home() {
  const [startDate, setStartDate] = useState<DateObject | null>(
    new DateObject('2025-02-19')
  );

  const ago = getAgoFromDate(startDate?.toDate() ?? new Date(), {
    live: true,
  });

  const timeUnits = [
    { value: ago.years, label: 'سال', show: ago.years > 0 },
    { value: ago.months, label: 'ماه', show: ago.months > 0 },
    { value: ago.days, label: 'روز', show: ago.days > 0 },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-900">
      <div className="space-y-8 text-center">
        {timeUnits.map(
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

        {timeUnits.every((unit) => !unit.show) && (
          <div className="text-4xl text-gray-400">هنوز زمانی نگذشته</div>
        )}
      </div>
      <div className="fixed bottom-4 left-4 z-50">
        <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray-800 p-4 shadow-lg transition-colors hover:bg-gray-700 focus:bg-gray-700">
          <DatePicker
            value={startDate}
            onChange={(newVal: DateObject | null) => {
              setStartDate(newVal);
            }}
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
