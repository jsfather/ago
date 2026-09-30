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

  return (
    <section
      className="surface-card card-padding"
      aria-label="پیشرفت بازه زمانی"
    >
      <div className="card-heading">
        <h2>پیشرفت</h2>
        <span className="badge">
          {isComplete ? 'کامل شده' : hasStarted ? 'در جریان' : 'به‌زودی'}
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="progress-number">
          {Number(progress.toFixed(1)).toLocaleString('fa-IR')}
          <span>٪</span>
        </div>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="پیشرفت"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(progress.toFixed(1))}
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-stats">
        <div>
          <strong>
            {isComplete
              ? '✓'
              : !hasStarted
                ? '—'
                : formatRemainingTime(
                    remainingDays,
                    remainingMonths
                  ).value.toLocaleString('fa-IR')}
          </strong>
          <span>
            {isComplete
              ? 'کامل شده'
              : !hasStarted
                ? 'شروع نشده'
                : `${formatRemainingTime(remainingDays, remainingMonths).unit} باقی‌مونده`}
          </span>
        </div>
        <div>
          <strong>
            {formatTotalTime(totalDays, totalMonths).value.toLocaleString(
              'fa-IR'
            )}
          </strong>
          <span>{formatTotalTime(totalDays, totalMonths).unit} کل</span>
        </div>
      </div>
      {isSoldier && hasStarted && !isComplete && (
        <div className="badge mt-5">
          <RankBadge level={getSoldierLevel(elapsedMonths)} />
          {getSoldierPhrase(elapsedMonths)}
        </div>
      )}
    </section>
  );
}
