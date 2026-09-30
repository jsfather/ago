'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Hourglass, ArrowLeft } from 'lucide-react';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DateInputGroup, {
  type DateFields,
  emptyFields,
  dateObjectToFields,
  fieldsToDateObject,
} from './DateInputGroup';

interface DateSelectionModalProps {
  isOpen: boolean;
  onDateSelect: (date: DateObject) => void;
  initialDate?: DateObject | null;
}

export default function DateSelectionModal({
  isOpen,
  onDateSelect,
  initialDate,
}: DateSelectionModalProps) {
  const [fields, setFields] = useState<DateFields>(emptyFields);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (initialDate) {
      setFields(dateObjectToFields(initialDate));
    }
  }, [initialDate]);

  const handleChange = useCallback((newFields: DateFields) => {
    setFields(newFields);
    setError('');
  }, []);

  const handleConfirm = () => {
    if (!fields.year || !fields.month || !fields.day) {
      setError('لطفاً تاریخ رو کامل وارد کن');
      return;
    }
    const dateObj = fieldsToDateObject(fields);
    if (!dateObj) {
      setError('تاریخ نامعتبر');
      return;
    }

    // Start date cannot be in the future
    const today = new DateObject({
      date: new Date(),
      calendar: persian,
      locale: persian_fa,
    });
    if (dateObj.toDate() > today.toDate()) {
      setError('تاریخ شروع نمی‌تونه از امروز بزرگتر باشه');
      return;
    }

    onDateSelect(dateObj);
  };

  return (
    <dialog
      ref={dialogRef}
      className="onboarding"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
      onCancel={(event) => event.preventDefault()}
    >
      <span className="brand-symbol">
        <Hourglass size={23} />
      </span>
      <span className="eyebrow mt-7">به ago خوش اومدی</span>
      <h2 id="welcome-title">
        هر داستانی،
        <br />
        یه روز شروع شده.
      </h2>
      <p id="welcome-description">
        تاریخ شروع داستانت رو وارد کن؛ ما روزها رو برات می‌شماریم. تاریخ پایان
        رو هم بعداً می‌تونی اضافه کنی.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleConfirm();
        }}
      >
        <span className="setting-label">تاریخ شروع به شمسی</span>
        <DateInputGroup fields={fields} onChange={handleChange} />
        {error && (
          <div className="field-error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="button-primary mt-6 w-full">
          بزن بریم
          <ArrowLeft size={17} />
        </button>
      </form>
    </dialog>
  );
}
