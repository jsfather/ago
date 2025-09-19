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
    <div className="flex items-center justify-center h-[25vh] px-4 py-2 w-full">
      {/* Liquid glass progress container */}
      <div className="relative group w-full max-w-sm">
        {/* Outer glow with liquid effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-[1.5rem] blur-lg opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
        
        {/* Main liquid glass container */}
        <div className="relative rounded-[1.5rem] bg-gradient-to-br from-white/[0.12] via-white/[0.06] to-white/[0.03] backdrop-blur-3xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Animated liquid background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-purple-500/[0.04] animate-pulse"></div>
          
          {/* Inner border glow */}
          <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-white/[0.08] to-transparent"></div>
          
          {/* Content container with liquid padding */}
          <div className="relative p-4 space-y-3">
            {/* Liquid glass percentage display */}
            <div className="flex items-center justify-center">
              <div className="relative group/percentage">
                {/* Percentage glow background */}
                <div className="absolute inset-0 scale-110 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 rounded-lg blur-md opacity-50 group-hover/percentage:opacity-100 transition-opacity duration-500"></div>
                
                {/* Liquid glass percentage container */}
                <div className="relative bg-gradient-to-br from-white/[0.15] via-white/[0.08] to-transparent rounded-lg backdrop-blur-xl border border-white/[0.25] px-3 py-1.5">
                  <div className="absolute inset-[1px] rounded-[calc(0.5rem-1px)] bg-gradient-to-br from-white/[0.1] to-transparent"></div>
                  <span className="relative text-sm font-black tracking-wider bg-gradient-to-br from-white via-blue-50 to-cyan-50 bg-clip-text text-transparent drop-shadow-lg">
                    %{Math.round(progress)}
                  </span>
                </div>
              </div>
            </div>

            {/* Liquid glass progress track */}
            <div className="relative group/track">
              {/* Track glow background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-sm"></div>
              
              {/* Main track container */}
              <div className="relative h-2.5 rounded-full bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-white/[0.08] backdrop-blur-xl border border-white/[0.15] shadow-inner overflow-hidden">
                {/* Inner track glow */}
                <div className="absolute inset-[1px] rounded-full bg-gradient-to-r from-white/[0.05] to-transparent"></div>
                
                {/* Liquid progress fill */}
                <div
                  className={`relative h-full rounded-full ${getProgressGradient()} overflow-hidden transition-all duration-1000 ease-out shadow-lg`}
                  style={{ width: `${progress}%` }}
                >
                  {/* Liquid flow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.3] via-white/[0.15] to-white/[0.3] rounded-full"></div>
                  
                  {/* Animated liquid shimmer */}
                  <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  
                  {/* Liquid glow overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.1] via-transparent to-white/[0.1] shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>
            </div>

            {/* Liquid glass status section */}
            <div className="flex items-center justify-between">
              {/* Status text container */}
              <div className="relative group/status">
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-white/[0.04] rounded-md backdrop-blur-sm"></div>
                <div className="relative px-2 py-0.5 text-xs font-semibold text-white/90 tracking-wide group-hover/status:text-white transition-colors duration-300">
                  {getStatusText()}
                </div>
              </div>
              
              {/* Total days container */}
              <div className="relative group/total">
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-white/[0.03] rounded-md backdrop-blur-sm"></div>
                <div className="relative px-2 py-0.5 text-xs font-medium text-white/70 group-hover/total:text-white/90 transition-colors duration-300">
                  {totalDays} روز کل
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
