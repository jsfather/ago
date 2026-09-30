'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStoredDateRange } from '../hooks/useStoredDateRange';
import { CalendarDays, Flag, Check, Sprout, X } from 'lucide-react';
import PageHeading from './PageHeading';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateInputGroup, {
  type DateFields,
  emptyFields,
  dateObjectToFields,
  fieldsToDateObject,
} from './DateInputGroup';

export default function CalendarPage() {
  const { dateRange, saveDateRange } = useStoredDateRange();
  const [startFields, setStartFields] = useState<DateFields>(emptyFields);
  const [endFields, setEndFields] = useState<DateFields>(emptyFields);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  // Populate fields from stored date range on mount
  useEffect(() => {
    if (dateRange && dateRange.length > 0) {
      setStartFields(dateObjectToFields(dateRange[0]));
      if (dateRange.length > 1) {
        setEndFields(dateObjectToFields(dateRange[1]));
      }
    }
  }, [dateRange]);

  const handleStartChange = useCallback(
    (fields: DateFields) => {
      setStartFields(fields);
      setStartError('');

      // Only save when all fields are filled
      if (!fields.year || !fields.month || !fields.day) return;

      const dateObj = fieldsToDateObject(fields);
      if (!dateObj) {
        setStartError('تاریخ نامعتبر');
        return;
      }

      // Start date cannot be in the future
      const today = new DateObject({
        date: new Date(),
        calendar: persian,
        locale: persian_fa,
      });
      const jalaliInput = new DateObject({
        date: dateObj.toDate(),
        calendar: persian,
        locale: persian_fa,
      });
      if (jalaliInput.toDate() > today.toDate()) {
        setStartError('تاریخ شروع نمی‌تونه از امروز بزرگتر باشه');
        return;
      }

      const endDateObj = fieldsToDateObject(endFields);
      const newRange = endDateObj ? [dateObj, endDateObj] : [dateObj];
      if (!saveDateRange(newRange))
        setStartError('تاریخ شروع باید قبل از تاریخ پایان باشه.');
    },
    [endFields, saveDateRange]
  );

  const handleEndChange = useCallback(
    (fields: DateFields) => {
      setEndFields(fields);
      setEndError('');

      // Only save when all fields are filled
      if (!fields.year || !fields.month || !fields.day) return;

      const dateObj = fieldsToDateObject(fields);
      if (!dateObj) {
        setEndError('تاریخ نامعتبر');
        return;
      }

      const startDateObj = fieldsToDateObject(startFields);
      if (startDateObj) {
        if (!saveDateRange([startDateObj, dateObj]))
          setEndError('تاریخ پایان باید بعد از تاریخ شروع باشه.');
      }
    },
    [startFields, saveDateRange]
  );

  const clearEndDate = useCallback(() => {
    setEndFields(emptyFields);
    setEndError('');
    const startDateObj = fieldsToDateObject(startFields);
    if (startDateObj) {
      saveDateRange([startDateObj]);
    }
  }, [startFields, saveDateRange]);

  const hasEndDate =
    endFields.year !== '' || endFields.month !== '' || endFields.day !== '';

  return (
    <div className="animate-enter">
      <PageHeading
        eyebrow="نقطه شروع، خط پایان"
        title="روزهای مهمت رو مشخص کن."
        description="تاریخ‌ها به شمسی هستن و تغییرات معتبر خودکار ذخیره می‌شن."
      />
      <div className="calendar-layout">
        <section className="surface-card card-padding">
          <div className="date-step">
            <div className="card-heading">
              <h2 className="flex items-center gap-2">
                <CalendarDays size={18} />
                تاریخ شروع
              </h2>
              <span className="badge">از این روز</span>
            </div>
            <DateInputGroup fields={startFields} onChange={handleStartChange} />
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
              autoFocus={false}
            />
            {endError && (
              <p className="field-error" role="alert">
                {endError}
              </p>
            )}
          </div>
          <p className="setting-hint flex items-center gap-2">
            <Check size={15} />
            تاریخ‌های معتبر روی همین دستگاه ذخیره می‌شن.
          </p>
        </section>
        <aside className="calendar-note">
          <Sprout size={48} strokeWidth={1.2} />
          <h2>
            گاهی خودِ مسیر،
            <br />
            قشنگ‌ترین بخش داستانه.
          </h2>
          <p>
            با تاریخ شروع، روزهایی که گذشته رو ببین. با اضافه کردن تاریخ پایان،
            می‌فهمی چقدر از مسیر رو رفتی و چقدر تا مقصد مونده.
          </p>
        </aside>
      </div>
    </div>
  );
}
