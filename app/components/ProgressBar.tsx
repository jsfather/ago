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
      return (
        <>
          <span>{remainingDays}</span> روز باقی مانده
        </>
      );
    } else {
      return 'هنوز شروع نشده';
    }
  };

  return (
    <div className="flex h-[25vh] w-full items-center justify-center px-4 py-2">
      {/* Liquid glass progress container */}
      <div className="relative w-full max-w-sm">
        {/* Main liquid glass container */}
        <div className="liquid-glass overflow-hidden">
          {/* Content container with liquid padding */}
          <div className="relative space-y-3 p-4">
            {/* Liquid glass percentage display */}
            <div className="flex items-center justify-center">
              <div className="liquid-glass-subtle px-3 py-1.5">
                <span className="text-sm font-black tracking-wider text-white/95">
                  %{Math.round(progress)}
                </span>
              </div>
            </div>

            {/* Liquid glass progress track */}
            <div className="relative">
              {/* Main track container */}
              <div className="liquid-glass-subtle h-2.5 overflow-hidden rounded-full">
                {/* Liquid progress fill */}
                <div
                  className={`relative h-full rounded-full ${getProgressGradient()} overflow-hidden transition-all duration-1000 ease-out`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Liquid flow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.2] via-white/[0.1] to-white/[0.2]"></div>

                  {/* Animated liquid shimmer */}
                  <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Liquid glass status section */}
            <div className="flex items-center justify-between">
              {/* Status text container */}
              <div className="rounded-md bg-white/[0.04] px-2 py-0.5">
                <div className="text-xs font-semibold tracking-wide text-white/90">
                  {getStatusText()}
                </div>
              </div>

              {/* Total days container */}
              <div className="rounded-md bg-white/[0.04] px-2 py-0.5">
                <div className="text-xs font-medium text-white/70">
                  <span>{totalDays}</span> روز کل
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
