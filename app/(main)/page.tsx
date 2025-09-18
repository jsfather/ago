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
    <div className="relative flex min-h-screen items-center justify-center bg-[#101828] overflow-hidden">
      {/* Enhanced liquid background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101828]/95 via-[#1a202c]/90 to-[#0f172a]/95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(99,102,241,0.06),transparent_50%)]"></div>
      
      {/* Animated floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <ProgressBar dateRange={dateRange} />

      <DateSelectionModal
        isOpen={isFirstVisit}
        onDateSelect={handleModalDateSelect}
        initialDate={startDate}
      />

      {/* Liquid glass main content container with proper spacing */}
      <div className="relative z-10 space-y-12 text-center px-8 pt-32">
        {/* Revolutionary liquid glass container */}
        <div className="relative group">
          {/* Outer glow effect */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
          
          {/* Main liquid glass container */}
          <div className="relative rounded-[3rem] bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Animated liquid overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-purple-500/[0.03] animate-pulse"></div>
            
            {/* Inner border glow */}
            <div className="absolute inset-[1px] rounded-[calc(3rem-1px)] bg-gradient-to-br from-white/[0.08] to-transparent"></div>
            
            {/* Content container */}
            <div className="relative p-12 space-y-8">
              {currentDate &&
                timeUnits.map(
                  (unit, index) =>
                    unit.show && (
                      <div key={index} className="flex flex-col items-center group/item">
                        {/* Liquid glass number container - reduced size */}
                        <div className="relative mb-4">
                          {/* Number background glow */}
                          <div className="absolute inset-0 scale-110 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl blur-xl opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all duration-500"></div>
                          
                          {/* Liquid glass number background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl backdrop-blur-xl border border-white/20"></div>
                          
                          {/* Number text with liquid effect - reduced from text-[8rem] to text-6xl */}
                          <div className="relative px-6 py-3 font-mono text-6xl font-black tracking-tight">
                            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent blur-sm opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent drop-shadow-2xl">
                              {unit.value}
                            </div>
                          </div>
                        </div>
                        
                        {/* Liquid glass label - reduced from text-3xl to text-xl */}
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl backdrop-blur-sm"></div>
                          <div className="relative px-4 py-2 text-xl font-bold text-white/90 tracking-wide group-hover/item:text-white transition-colors duration-300">
                            {unit.label}
                          </div>
                        </div>
                      </div>
                    )
                )}

              {currentDate && timeUnits.every((unit) => !unit.show) && (
                <div className="relative group/empty">
                  {/* Empty state liquid glass container */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-2xl blur-xl group-hover/empty:from-blue-500/10 group-hover/empty:to-purple-500/10 transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-white/5 to-transparent rounded-2xl backdrop-blur-xl border border-white/10 px-8 py-6">
                    <div className="text-2xl font-bold text-white/70 group-hover/empty:text-white/90 transition-colors duration-300">
                      هنوز زمانی نگذشته
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isFirstVisit && (
        <div className="fixed bottom-8 left-8 z-50">
          {/* Liquid glass floating action button */}
          <div className="relative group">
            {/* Outer glow with liquid effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            
            {/* Liquid glass button container */}
            <div className="relative">
              {/* Animated background orb */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
              
              {/* Main button with liquid glass effect */}
              <div className="relative flex cursor-pointer items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/[0.2] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:scale-105">
                {/* Inner border glow */}
                <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/[0.1] to-transparent"></div>
                
                {/* Liquid overlay animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/[0.05] via-transparent to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
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
                  render={<Icon width={40} height={40} color="#ffffff" className="relative z-10 drop-shadow-lg" />}
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
