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

    return {
      progress,
      startDate,
      endDate,
      isComplete: currentDate >= endDate,
      hasStarted: currentDate >= startDate,
    };
  }, [dateRange]);

  if (!progressData) {
    return null;
  }

  const { progress, isComplete, hasStarted } = progressData;

  return (
    <div className="fixed top-4 left-1/2 z-50 w-80 -translate-x-1/2 transform">
      <div className="rounded-full bg-gray-800 p-1 shadow-lg">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-600">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isComplete
                ? 'bg-green-500'
                : hasStarted
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
            }`}
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
