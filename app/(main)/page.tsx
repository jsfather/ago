'use client';

import { getAgoFromDate } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import { CalendarDays, ArrowUpLeft, MoveUpRight, Sprout } from 'lucide-react';
import DateSelectionModal from '@/app/components/DateSelectionModal';
import ProgressBar from '@/app/components/ProgressBar';
import JokeComponent from '@/app/components/JokeComponent';
import PageHeading from '@/app/components/PageHeading';
import { useStoredDateRange } from '@/app/hooks/useStoredDateRange';
import { useAppNavigation } from '@/app/components/NavigationWrapper';

export default function Home() {
  const { dateRange, startDate, isFirstVisit, updateStartDate } =
    useStoredDateRange();
  const navigate = useAppNavigation();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const ago =
    startDate && now
      ? getAgoFromDate(startDate.toDate())
      : { years: 0, months: 0, days: 0 };
  const totalDays =
    startDate && now
      ? Math.max(
          0,
          Math.floor((now.getTime() - startDate.toDate().getTime()) / 86400000)
        )
      : 0;
  const dateLabel = startDate
    ? new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(startDate.toDate())
    : '…';

  return (
    <div className="animate-enter">
      <PageHeading
        eyebrow="روایتِ روزهای تو"
        title="هر روز، یک قدم جلوتر."
        description="از اون روز تا امروز؛ ببین چقدر راه اومدی."
        action={
          <button
            className="button-secondary"
            onClick={() => navigate('calendar')}
          >
            <CalendarDays size={16} />
            ویرایش تاریخ
          </button>
        }
      />
      <div className="dashboard-grid">
        <section className="time-card" aria-label="زمان سپری‌شده">
          <div className="time-card-top">
            <span>
              <span className="status-dot" />
              زمان سپری‌شده
            </span>
            <MoveUpRight size={19} />
          </div>
          <div className="time-dial">
            <svg viewBox="0 0 320 320" fill="none" aria-hidden="true">
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="var(--hero-line)"
                strokeWidth="0.5"
              />
              {Array.from({ length: 60 }, (_, i) => (
                <line
                  key={i}
                  x1="160"
                  y1="23"
                  x2="160"
                  y2={i % 5 === 0 ? '37' : '29'}
                  stroke={i % 5 === 0 ? 'var(--hero-ink)' : 'var(--hero-line)'}
                  strokeWidth={i % 5 === 0 ? '2' : '1'}
                  transform={`rotate(${i * 6} 160 160)`}
                />
              ))}
              <circle
                cx="160"
                cy="160"
                r="111"
                stroke="var(--hero-line)"
                strokeDasharray="2 7"
                opacity=".65"
              />
              <circle
                cx="267"
                cy="65"
                r="7"
                fill="#e99a6d"
                stroke="var(--hero-bg)"
                strokeWidth="4"
              />
              <path
                d="M151 87h18m-9-9v18"
                stroke="var(--hero-muted)"
                strokeWidth="1.5"
              />
              <path d="M156 238h8" stroke="var(--hero-muted)" strokeWidth="2" />
            </svg>
            <div className="dial-center">
              <strong>
                {now && startDate ? totalDays.toLocaleString('fa-IR') : '—'}
              </strong>
              <span>روز از شروع داستانت</span>
            </div>
          </div>
          <div className="time-breakdown">
            {[
              { value: ago.years, label: 'سال' },
              { value: ago.months, label: 'ماه' },
              { value: ago.days, label: 'روز' },
            ].map((unit) => (
              <div key={unit.label}>
                <strong>{unit.value.toLocaleString('fa-IR')}</strong>
                <span>{unit.label}</span>
              </div>
            ))}
          </div>
          <p className="time-origin">
            <CalendarDays size={14} />
            شروع از {dateLabel}
          </p>
        </section>
        <div className="dashboard-aside">
          {dateRange && dateRange.length >= 2 ? (
            <ProgressBar dateRange={dateRange} />
          ) : (
            <section className="surface-card card-padding">
              <div className="card-heading">
                <h2>قدم بعدی کجاست؟</h2>
                <Sprout className="card-icon" />
              </div>
              <p className="text-secondary mb-5 text-sm leading-8">
                یه تاریخ پایان مشخص کن تا روزهای باقی‌مونده و پیشرفت مسیرت رو هم
                ببینی.
              </p>
              <button
                className="button-secondary w-full"
                onClick={() => navigate('calendar')}
              >
                انتخاب تاریخ پایان
                <ArrowUpLeft size={17} />
              </button>
            </section>
          )}
          <JokeComponent />
        </div>
      </div>
      <p className="app-footnote">
        <Sprout size={14} />
        آروم و پیوسته؛ روزهای خوب از راه می‌رسن.
      </p>
      <DateSelectionModal
        isOpen={isFirstVisit}
        onDateSelect={updateStartDate}
        initialDate={startDate}
      />
    </div>
  );
}
