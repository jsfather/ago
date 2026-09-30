import { DateObject } from 'react-multi-date-picker';
import {
  type DateFields,
  fieldsToDateObject,
} from '../components/DateInputGroup';

type DateRangeValidation =
  | { range: DateObject[]; startError: ''; endError: '' }
  | { range: null; startError: string; endError: string };

/** Validate a complete draft before replacing the last saved range. */
export function validateDateRangeDraft(
  start: DateFields,
  end: DateFields,
  today = new Date()
): DateRangeValidation {
  const startDate = fieldsToDateObject(start);
  const hasEndDate = Boolean(end.year || end.month || end.day);
  const endDate = hasEndDate ? fieldsToDateObject(end) : null;
  let startError = '';
  let endError = '';

  if (!startDate) {
    startError = 'تاریخ شروع رو کامل و درست وارد کن.';
  } else if (startDate.toDate() > today) {
    startError = 'تاریخ شروع نمی‌تونه از امروز بزرگتر باشه.';
  }

  if (hasEndDate && !endDate) {
    endError = 'تاریخ پایان رو کامل و درست وارد کن.';
  } else if (startDate && endDate && endDate.toDate() < startDate.toDate()) {
    endError = 'تاریخ پایان نمی‌تونه قبل از تاریخ شروع باشه.';
  }

  if (!startDate || startError || endError) {
    return { range: null, startError, endError };
  }
  return {
    range: endDate ? [startDate, endDate] : [startDate],
    startError: '',
    endError: '',
  };
}
