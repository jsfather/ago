'use client';

import { DateObject } from 'react-multi-date-picker';
import { useMemo } from 'react';
import { useTimeDisplayFormat } from '../hooks/useTimeDisplayFormat';
import { useSoldierMode } from '../hooks/useSoldierMode';

/** Dynamic military rank badge SVG based on soldier level (1-8) */
function RankBadge({ level, size = 16 }: { level: number; size?: number }) {
  const stroke = 'var(--text-primary)';
  const sw = 2.5;
  const cap = 'round' as const;
  const join = 'round' as const;

  // Levels 1-4: horizontal bars (like hamburger icon)
  if (level <= 4) {
    const barCount = level;
    const gap = 5;
    const totalHeight = (barCount - 1) * gap;
    const startY = 12 - totalHeight / 2;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="shrink-0"
      >
        {Array.from({ length: barCount }, (_, i) => (
          <line
            key={i}
            x1="6"
            y1={startY + i * gap}
            x2="18"
            y2={startY + i * gap}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap={cap}
          />
        ))}
      </svg>
    );
  }

  // Levels 5-7: chevrons pointing up
  if (level <= 7) {
    const chevronCount = level - 4; // 1, 2, or 3
    const gap = 6;
    const chevronH = 6;
    const totalHeight = (chevronCount - 1) * gap + chevronH;
    const centerY = 14; // center of 28-height viewBox
    const startY = centerY + totalHeight / 2;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 28"
        fill="none"
        className="shrink-0"
      >
        {Array.from({ length: chevronCount }, (_, i) => {
          const baseY = startY - i * gap;
          return (
            <path
              key={i}
              d={`M6 ${baseY}L12 ${baseY - 6}L18 ${baseY}`}
              stroke={stroke}
              strokeWidth={sw}
              strokeLinecap={cap}
              strokeLinejoin={join}
            />
          );
        })}
      </svg>
    );
  }

  // Level 8: star
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.5L5.8 21L7.2 14L2 9.3L9.1 8.6L12 2Z"
        fill={stroke}
        opacity="0.85"
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin={join}
      />
    </svg>
  );
}

/** Get soldier rank level (1-8) from elapsed months */
function getSoldierLevel(months: number): number {
  if (months < 3) return 1;
  if (months < 6) return 2;
  if (months < 9) return 3;
  if (months < 12) return 4;
  if (months < 15) return 5;
  if (months < 18) return 6;
  if (months < 21) return 7;
  return 8;
}

interface ProgressBarProps {
  dateRange: DateObject[] | null;
}

export default function ProgressBar({ dateRange }: ProgressBarProps) {
  const { format } = useTimeDisplayFormat();
  const { isSoldier } = useSoldierMode();

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

    // Calculate elapsed months from start date
    const elapsedDays = Math.max(
      0,
      Math.floor(elapsedDuration / (1000 * 60 * 60 * 24))
    );
    const elapsedMonths = elapsedDays / 30.44;

    // Calculate remaining and total months using floor to show complete months only
    const remainingMonths = Math.floor(remainingDays / 30.44);
    const totalMonths = Math.round(totalDays / 30.44);

    return {
      progress,
      startDate,
      endDate,
      remainingDays,
      totalDays,
      remainingMonths,
      totalMonths,
      elapsedMonths,
      isComplete: currentDate >= endDate,
      hasStarted: currentDate >= startDate,
    };
  }, [dateRange]);

  // Helper function to format remaining time based on selected format
  const formatRemainingTime = (
    days: number,
    months: number
  ): { value: number; unit: string } => {
    switch (format) {
      case 'months':
        return { value: months, unit: 'ماه' };
      case 'days':
      default:
        return { value: days, unit: 'روز' };
    }
  };

  // Helper function to format total time
  const formatTotalTime = (
    days: number,
    months: number
  ): { value: number; unit: string } => {
    switch (format) {
      case 'months':
        return { value: months, unit: 'ماه' };
      case 'days':
      default:
        return { value: days, unit: 'روز' };
    }
  };

  // Get soldier phrase based on elapsed months (each phase is 3 months)
  const getSoldierPhrase = (months: number): string => {
    if (!isSoldier) return '';

    if (months < 3) {
      return 'سوپر موتور';
    } else if (months < 6) {
      return 'موتور';
    } else if (months < 9) {
      return 'جدید';
    } else if (months < 12) {
      return 'صفر ترکیده';
    } else if (months < 15) {
      return 'قدیمی';
    } else if (months < 18) {
      return 'سالار';
    } else if (months < 21) {
      return 'مت یاکوزا';
    } else {
      return 'مت مهربانی';
    }
  };

  if (!progressData) {
    return null;
  }

  const {
    progress,
    remainingDays,
    totalDays,
    remainingMonths,
    totalMonths,
    elapsedMonths,
    isComplete,
    hasStarted,
  } = progressData;

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

  return (
    <div className="flex w-full items-center justify-center py-2">
      {/* Liquid glass progress container */}
      <div className="relative w-full">
        {/* Main liquid glass container */}
        <div className="liquid-glass overflow-hidden">
          {/* Content container with liquid padding */}
          <div className="relative space-y-3 p-4">
            {/* Liquid glass percentage display */}
            <div className="flex items-center justify-center">
              <div className="liquid-glass-subtle px-3 py-1.5">
                <span
                  className="text-sm font-black tracking-wider"
                  style={{ color: 'var(--text-primary)' }}
                >
                  %{parseFloat(progress.toFixed(2))}
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

            {/* Status info cards */}
            <div className="space-y-2">
              {/* Soldier phrase badge - prominent center */}
              {isSoldier && hasStarted && !isComplete && (
                <div className="flex justify-center">
                  <div className="liquid-glass-subtle flex items-center gap-1.5 px-4 pt-1 pb-1.5">
                    <RankBadge
                      level={getSoldierLevel(elapsedMonths)}
                      size={16}
                    />
                    <span
                      className="text-xs font-bold tracking-wide"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {getSoldierPhrase(elapsedMonths)}
                    </span>
                    <RankBadge
                      level={getSoldierLevel(elapsedMonths)}
                      size={16}
                    />
                  </div>
                </div>
              )}

              {/* Remaining + Total row */}
              <div className="flex items-stretch gap-2" dir="rtl">
                {/* Remaining time card */}
                <div className="liquid-glass-subtle flex flex-1 flex-col items-center justify-center px-3 py-2.5">
                  <span
                    className="text-lg leading-none font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {isComplete
                      ? '✓'
                      : !hasStarted
                        ? '—'
                        : formatRemainingTime(remainingDays, remainingMonths).value}
                  </span>
                  <span
                    className="mt-1 text-[10px] font-semibold tracking-wide"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {isComplete
                      ? 'کامل شده'
                      : !hasStarted
                        ? 'شروع نشده'
                        : `${formatRemainingTime(remainingDays, remainingMonths).unit} باقی مانده`}
                  </span>
                </div>

                {/* Total time card */}
                <div className="liquid-glass-subtle flex flex-1 flex-col items-center justify-center px-3 py-2.5">
                  <span
                    className="text-lg leading-none font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {formatTotalTime(totalDays, totalMonths).value}
                  </span>
                  <span
                    className="mt-1 text-[10px] font-semibold tracking-wide"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {formatTotalTime(totalDays, totalMonths).unit} کل
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
