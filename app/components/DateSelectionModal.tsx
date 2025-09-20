'use client';

import { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Solid backdrop */}
      <div className="absolute inset-0 bg-[#081827]"></div>

      {/* Liquid glass modal container */}
      <div className="relative mx-auto max-w-2xl px-6">
        {/* Main liquid glass modal */}
        <div className="relative">
          {/* Liquid glass container */}
          <div className="liquid-glass overflow-hidden">
            {/* Content container */}
            <div className="relative space-y-10 p-12">
              {/* Header section */}
              <div className="space-y-4 text-center">
                <div className="relative">
                  {/* Title container */}
                  <div className="liquid-glass px-8 py-4">
                    <h2 className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-3xl font-black tracking-wide text-transparent">
                      تاریخ شروع رو انتخاب کن
                    </h2>
                  </div>
                </div>

                <div className="liquid-glass-subtle px-6 py-3">
                  <p className="mx-auto max-w-md text-base leading-relaxed text-white/70">
                    بعداً می‌تونی بازه زمانی مورد نظرت رو انتخاب کنی
                  </p>
                </div>
              </div>

              {/* Date picker container */}
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  {/* Liquid glass picker container */}
                  <div className="liquid-glass overflow-hidden">
                    <DatePicker
                      value={selectedDate}
                      onChange={(newVal: DateObject | null) => {
                        setSelectedDate(newVal);
                      }}
                      calendar={persian}
                      locale={persian_fa}
                      maxDate={new Date()}
                      portal
                      className="liquid-calendar"
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        background: '#081827',
                      }}
                      inputClass="w-full text-white/95 text-center py-5 px-8 text-xl font-semibold tracking-wide focus:outline-none transition-all duration-300 placeholder-white/50"
                      containerStyle={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        background: '#081827',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Button section */}
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="liquid-glass overflow-hidden px-12 py-4 text-xl font-bold text-white/95 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent">
                    تایید
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
