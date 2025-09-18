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
      return 'مکمل شده';
    } else if (hasStarted) {
      return `${remainingDays} روز باقی مانده`;
    } else {
      return 'هنوز شروع نشده';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-[28rem] -translate-x-1/2 transform">
      {/* Enhanced main container with improved glassmorphism effect */}
      <div className="relative rounded-3xl bg-gray-800/40 backdrop-blur-2xl border border-gray-700/30 shadow-2xl p-4">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-600/10 via-transparent to-gray-800/10 rounded-3xl pointer-events-none"></div>
        
        {/* Inner content with relative positioning */}
        <div className="relative">
          {/* Enhanced header with glow effect */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-gradient-to-r from-gray-400/30 to-gray-300/30 rounded-xl"></div>
              <span className="relative text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                %{Math.round(progress)}
              </span>
            </div>
          </div>

          {/* Enhanced progress track container */}
          <div className="relative mb-6">
            {/* Track background with inner shadow */}
            <div className="h-3 w-full rounded-full bg-gray-700/50 shadow-inner border border-gray-600/30">
              {/* Progress fill with enhanced gradients and animations */}
              <div
                className={`h-full rounded-full ${getProgressGradient()} relative overflow-hidden shadow-lg transition-all duration-1000 ease-out`}
                style={{ width: `${progress}%` }}
              >
                {/* Enhanced animated shimmer effect */}
                <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                {/* Additional glow effect */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
              </div>
            </div>
          </div>

          {/* Enhanced status and info section */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-200 tracking-wide">{getStatusText()}</span>
            <span className="text-gray-400 font-medium">{totalDays} روز کل</span>
          </div>
        </div>
      </div>
    </div>
  );
}
