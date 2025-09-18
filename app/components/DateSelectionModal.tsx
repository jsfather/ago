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
      {/* Liquid glass backdrop with flowing effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-indigo-950/90 to-blue-950/95 backdrop-blur-3xl"></div>
      
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Liquid glass modal container */}
      <div className="relative max-w-2xl mx-auto px-6">
        {/* Outer liquid glow */}
        <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-cyan-500/25 rounded-[3rem] blur-3xl opacity-60"></div>
        
        {/* Main liquid glass modal */}
        <div className="relative group">
          {/* Liquid glass container */}
          <div className="relative rounded-[3rem] bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.04] backdrop-blur-3xl border border-white/[0.2] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Animated liquid overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] animate-pulse"></div>
            
            {/* Inner border glow */}
            <div className="absolute inset-[1px] rounded-[calc(3rem-1px)] bg-gradient-to-br from-white/[0.1] to-transparent"></div>
            
            {/* Content container */}
            <div className="relative p-12 space-y-10">
              {/* Liquid glass header section */}
              <div className="text-center space-y-4">
                <div className="relative group/title">
                  {/* Title glow background */}
                  <div className="absolute inset-0 scale-110 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-2xl blur-xl opacity-50 group-hover/title:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Liquid glass title container */}
                  <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-transparent rounded-2xl backdrop-blur-xl border border-white/[0.2] px-8 py-4">
                    <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-gradient-to-br from-white/[0.08] to-transparent"></div>
                    <h2 className="relative text-3xl font-black tracking-wide bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent drop-shadow-lg">
                      تاریخ شروع رو انتخاب کن
                    </h2>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-white/[0.03] rounded-xl backdrop-blur-sm"></div>
                  <p className="relative px-6 py-3 text-white/80 text-base leading-relaxed max-w-md mx-auto">
                    بعداً می‌تونی بازه زمانی مورد نظرت رو انتخاب کنی
                  </p>
                </div>
              </div>

              {/* Liquid glass date picker container */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm group/picker">
                  {/* DatePicker glow background */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover/picker:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Liquid glass picker container */}
                  <div className="relative bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-white/[0.03] rounded-3xl backdrop-blur-2xl border border-white/[0.18] shadow-lg overflow-hidden">
                    <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-white/[0.08] to-transparent"></div>
                    
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
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                      inputClass="relative w-full bg-transparent text-white text-center py-5 px-8 text-xl font-semibold tracking-wide focus:outline-none transition-all duration-300 placeholder-white/50"
                      containerStyle={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Liquid glass button section */}
              <div className="flex justify-center">
                <div className="relative group/button">
                  {/* Button glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Liquid glass button */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-cyan-500/20 rounded-2xl blur-lg animate-pulse"></div>
                    
                    <button
                      onClick={handleConfirm}
                      className="relative bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.05] backdrop-blur-2xl border border-white/[0.25] rounded-2xl px-12 py-4 text-xl font-bold text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover/button:scale-105 overflow-hidden"
                    >
                      <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-gradient-to-br from-white/[0.1] to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent drop-shadow-lg">تایید</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
