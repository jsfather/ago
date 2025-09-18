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
    const remainingDuration = Math.max(
      0,
      endDate.getTime() - currentDate.getTime()
    );
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

  const { progress, remainingDays, totalDays, isComplete, hasStarted } =
    progressData;

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
      return 'کامل شده';
    } else if (hasStarted) {
      return `${remainingDays} روز باقی مانده`;
    } else {
      return 'هنوز شروع نشده';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-96 -translate-x-1/2 transform">
      {/* Main container with glassmorphism effect */}
      <div className="relative rounded-2xl bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-center">
          <span className="text-lg font-bold text-white">
            %{Math.round(progress)}
          </span>
        </div>

        {/* Progress track */}
        <div className="relative mb-4">
          <div className="h-2 w-full rounded-full bg-white/20 shadow-inner">
            {/* Progress fill with animation */}
            <div
              className={`h-full rounded-full ${getProgressGradient()} relative overflow-hidden shadow-lg transition-all duration-1000 ease-out`}
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Status and info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80">{getStatusText()}</span>
          <span className="text-white/60">{totalDays} روز کل</span>
        </div>
      </div>
    </div>
  );
}
