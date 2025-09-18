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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced backdrop with better blur and gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/95 to-gray-900/90 backdrop-blur-xl"></div>
      
      {/* Enhanced modal container */}
      <div className="relative w-full max-w-lg mx-6">
        {/* Glow effect background */}
        <div className="absolute -inset-1 bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-3xl blur-xl"></div>
        
        {/* Main modal content */}
        <div className="relative rounded-3xl bg-gray-800/90 backdrop-blur-2xl border border-gray-700/50 p-10 shadow-2xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700/10 via-transparent to-gray-800/10 rounded-3xl pointer-events-none"></div>
          
          {/* Content container */}
          <div className="relative">
            {/* Enhanced header section */}
            <div className="mb-8 text-center space-y-3">
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-xl"></div>
                <h2 className="relative text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                  تاریخ شروع رو انتخاب کن
                </h2>
              </div>
              <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
                بعداً می‌تونی بازه زمانی مورد نظرت رو انتخاب کنی
              </p>
            </div>

            {/* Enhanced date picker container */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-full">
                {/* Subtle glow behind date picker */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-2xl blur-lg"></div>
                
                <DatePicker
                  value={selectedDate}
                  onChange={(newVal: DateObject | null) => {
                    setSelectedDate(newVal);
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  maxDate={new Date()}
                  className="bg-dark"
                  style={{
                    width: '100%',
                  }}
                  inputClass="relative w-full rounded-2xl bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 text-white text-center py-4 px-6 text-xl font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 hover:bg-gray-600/80"
                />
              </div>
            </div>

            {/* Enhanced button section */}
            <div className="flex justify-center">
              <div className="relative group">
                {/* Button glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/50 to-gray-500/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <button
                  onClick={handleConfirm}
                  className="relative rounded-2xl bg-gradient-to-r from-gray-700 to-gray-600 backdrop-blur-sm border border-gray-600/50 px-10 py-4 text-xl font-bold text-white transition-all duration-300 hover:from-gray-600 hover:to-gray-500 hover:scale-105 focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none active:scale-95 shadow-xl"
                >
                  <span className="relative z-10">تایید</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
