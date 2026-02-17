'use client';

import { useState, useEffect, useCallback } from 'react';
import { DateObject } from 'react-multi-date-picker';
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
    onDateSelect(dateObj);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Solid backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--primary-bg)' }}
      ></div>

      {/* Liquid glass modal container */}
      <div className="relative mx-auto max-w-2xl px-6">
        {/* Main liquid glass modal */}
        <div className="relative">
          {/* Liquid glass container */}
          <div className="liquid-glass overflow-hidden">
            {/* Content container */}
            <div className="relative space-y-10 p-12">
              {/* Header section */}
              <div className="space-y-4 text-center">
                <div className="relative">
                  {/* Title container */}
                  <div className="liquid-glass px-8 py-4">
                    <h2
                      className="text-3xl font-black tracking-wide"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      تاریخ شروع رو انتخاب کن
                    </h2>
                  </div>
                </div>

                <div className="liquid-glass-subtle px-6 py-3">
                  <p
                    className="mx-auto max-w-md text-base leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    بعداً می‌تونی بازه زمانی مورد نظرت رو انتخاب کنی
                  </p>
                </div>
              </div>

              {/* Date input container */}
              <div className="flex justify-center">
                <div className="w-full max-w-sm space-y-3">
                  <DateInputGroup fields={fields} onChange={handleChange} />
                  {error && (
                    <p
                      className="text-center text-xs font-medium"
                      style={{ color: 'var(--button-danger-text)' }}
                    >
                      {error}
                    </p>
                  )}
                </div>
              </div>

              {/* Button section */}
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="liquid-glass overflow-hidden px-12 py-4 text-xl font-bold transition-all duration-300 hover:scale-105"
                  style={{ color: 'var(--text-primary)' }}
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
