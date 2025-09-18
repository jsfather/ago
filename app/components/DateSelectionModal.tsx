'use client';

import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface DateSelectionModalProps {
  isOpen: boolean;
  onDateSelect: (date: DateObject) => void;
  initialDate?: DateObject | null;
}

export default function DateSelectionModal({
  isOpen,
  onDateSelect,
  initialDate,
}: DateSelectionModalProps) {
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(
    initialDate || new DateObject('2025-02-19')
  );

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">
            تاریخ شروع رو انتخاب کن
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            بعداً می‌تونی بازه زمانی مورد نظرت رو انتخاب کنی
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <DatePicker
            value={selectedDate}
            onChange={(newVal: DateObject | null) => {
              setSelectedDate(newVal);
            }}
            calendar={persian}
            locale={persian_fa}
            maxDate={new Date()}
            className="custom-date-picker"
            style={{
              width: '100%',
            }}
            inputClass="w-full rounded-lg bg-gray-600 border border-gray-500 text-white text-center py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConfirm}
            className="rounded-xl bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
          >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
