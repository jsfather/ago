'use client';

import { useState, useEffect, useRef } from 'react';
import { useStoredDateRange } from '../hooks/useStoredDateRange';
import { CalendarDays, Flag, X } from 'lucide-react';
import PageHeading from './PageHeading';
import { validateDateRangeDraft } from '../lib/dateRangeValidation';
import DateInputGroup, {
  type DateFields,
  emptyFields,
  dateObjectToFields,
} from './DateInputGroup';

export default function CalendarPage() {
  const { dateRange, saveDateRange, isLoading } = useStoredDateRange();
  const [startFields, setStartFields] = useState<DateFields>(emptyFields);
  const [endFields, setEndFields] = useState<DateFields>(emptyFields);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const initialized = useRef(false);

  // Load once; successful saves must not overwrite fields still being edited.
  useEffect(() => {
    if (isLoading || initialized.current || !dateRange?.length) return;
    initialized.current = true;
    setStartFields(dateObjectToFields(dateRange[0]));
    setEndFields(dateRange[1] ? dateObjectToFields(dateRange[1]) : emptyFields);
  }, [dateRange, isLoading]);

  const commitDates = (start = startFields, end = endFields) => {
    const result = validateDateRangeDraft(start, end);
    setStartError(result.startError);
    setEndError(result.endError);
    if (result.range && !saveDateRange(result.range)) {
      setStartError('ذخیره تاریخ انجام نشد. دوباره امتحان کن.');
    }
  };

  const handleStartChange = (fields: DateFields) => {
    setStartFields(fields);
    setStartError('');
    setEndError('');
  };

  const handleEndChange = (fields: DateFields) => {
    setEndFields(fields);
    setStartError('');
    setEndError('');
  };

  const clearEndDate = () => {
    setEndFields(emptyFields);
    commitDates(startFields, emptyFields);
  };

  const hasEndDate =
    endFields.year !== '' || endFields.month !== '' || endFields.day !== '';

  return (
    <div className="calendar-page animate-enter">
      <PageHeading title="تاریخ‌ها" />
      <section className="surface-card card-padding">
        <div className="date-step">
          <div className="card-heading">
            <h2 className="flex items-center gap-2">
              <CalendarDays size={18} />
              تاریخ شروع (شمسی)
            </h2>
          </div>
          <DateInputGroup
            fields={startFields}
            onChange={handleStartChange}
            onCommit={() => commitDates()}
            disabled={isLoading}
          />
          {startError && (
            <p className="field-error" role="alert">
              {startError}
            </p>
          )}
        </div>
        <div className="date-step">
          <div className="card-heading">
            <h2 className="flex items-center gap-2">
              <Flag size={18} />
              تاریخ پایان{' '}
              <span className="text-tertiary text-xs font-normal">
                (اختیاری)
              </span>
            </h2>
            {hasEndDate && (
              <button
                onClick={clearEndDate}
                className="icon-button"
                aria-label="پاک کردن تاریخ پایان"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <DateInputGroup
            fields={endFields}
            onChange={handleEndChange}
            onCommit={() => commitDates()}
            disabled={isLoading}
            autoFocus={false}
          />
          {endError && (
            <p className="field-error" role="alert">
              {endError}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
