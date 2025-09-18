'use client';

import { DateObject } from 'react-multi-date-picker';
import { useMemo } from 'react';

interface ProgressBarProps {
  dateRange: DateObject[] | null;
}

export default function ProgressBar({ dateRange }: ProgressBarProps) {
  const progressData = useMemo(() => {
    if (!dateRange || dateRange.length < 2) {
      return null;
    }

    const startDate = dateRange[0].toDate();
    const endDate = dateRange[1].toDate();
    const currentDate = new Date();

    // Ensure start date is before end date
    if (startDate >= endDate) {
      return null;
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = currentDate.getTime() - startDate.getTime();

    // Calculate progress percentage (0-100)
    let progress = (elapsedDuration / totalDuration) * 100;
    
    // Clamp between 0 and 100
    progress = Math.max(0, Math.min(100, progress));

    // Calculate remaining days
    const remainingDuration = Math.max(0, endDate.getTime() - currentDate.getTime());
    const remainingDays = Math.ceil(remainingDuration / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

    return {
      progress,
      startDate,
      endDate,
      remainingDays,
      totalDays,
      isComplete: currentDate >= endDate,
      hasStarted: currentDate >= startDate,
    };
  }, [dateRange]);

  if (!progressData) {
    return null;
  }

  const { progress, remainingDays, totalDays, isComplete, hasStarted } = progressData;

  const getProgressGradient = () => {
    if (isComplete) {
      return 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600';
    } else if (hasStarted) {
      return progress > 75 
        ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'
        : progress > 50
        ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600'
        : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600';
    } else {
      return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getStatusText = () => {
    if (isComplete) {
      return 'مکمل شده';
    } else if (hasStarted) {
      return `${remainingDays} روز باقی مانده`;
    } else {
      return 'هنوز شروع نشده';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-96 -translate-x-1/2 transform">
      {/* Main container with glassmorphism effect */}
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`h-3 w-3 rounded-full ${isComplete ? 'bg-emerald-400' : hasStarted ? 'bg-blue-400' : 'bg-gray-400'} animate-pulse`}></div>
            <span className="text-sm font-medium text-white/90">پیشرفت بازه زمانی</span>
          </div>
          <span className="text-xs text-white/70">{Math.round(progress)}%</span>
        </div>

        {/* Progress track */}
        <div className="relative mb-4">
          <div className="h-2 w-full rounded-full bg-white/20 shadow-inner">
            {/* Progress fill with animation */}
            <div
              className={`h-full rounded-full ${getProgressGradient()} shadow-lg transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress indicator dot */}
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-lg transition-all duration-1000 ease-out border-2 border-current"
            style={{ 
              left: `calc(${progress}% - 8px)`,
              color: isComplete ? '#10b981' : hasStarted ? '#3b82f6' : '#6b7280'
            }}
          ></div>
        </div>

        {/* Status and info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80">{getStatusText()}</span>
          <span className="text-white/60">{totalDays} روز کل</span>
        </div>

        {/* Floating particles effect */}
        {hasStarted && !isComplete && (
          <>
            <div className="absolute -top-1 left-1/4 h-1 w-1 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute -top-2 right-1/3 h-1 w-1 rounded-full bg-purple-400/60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-1 left-2/3 h-1 w-1 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </div>
  );
}