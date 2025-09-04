'use client';

import { useState, useEffect } from 'react';
import { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const STORAGE_KEY = 'ago_start_date';
const DEFAULT_DATE = '2025-02-19';

// Helper function to validate DateObject
const isValidDateObject = (dateObj: DateObject): boolean => {
  try {
    // Try to convert to JavaScript Date and check if it's valid
    const jsDate = dateObj.toDate();
    return jsDate instanceof Date && !isNaN(jsDate.getTime());
  } catch (error) {
    console.log('Error validating DateObject:', error);
    return false;
  }
};

// Helper function to handle legacy Persian date format
const parseLegacyPersianDate = (dateString: string): DateObject | null => {
  try {
    // Check if it's a Persian date format (contains Persian digits or Persian date pattern)
    if (
      dateString.match(/[\u06F0-\u06F9]/g) ||
      dateString.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      // Try to parse as Persian date
      const persianDate = new DateObject({
        date: dateString,
        calendar: persian,
        locale: persian_fa,
      });

      if (isValidDateObject(persianDate)) {
        return persianDate;
      }
    }
    return null;
  } catch (error) {
    console.log('Error parsing legacy Persian date:', error);
    return null;
  }
};

export function useStoredStartDate() {
  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    try {
      const storedDate = localStorage.getItem(STORAGE_KEY);

      if (storedDate) {
        // User has visited before, load their stored date
        try {
          let dateObj: DateObject | null = null;

          // First, try to parse as ISO string (new format)
          const jsDate = new Date(storedDate);
          if (!isNaN(jsDate.getTime())) {
            dateObj = new DateObject(jsDate);
          } else {
            // If that fails, try to parse as legacy Persian date format
            dateObj = parseLegacyPersianDate(storedDate);
          }

          if (dateObj && isValidDateObject(dateObj)) {
            setStartDate(dateObj);
            setIsFirstVisit(false);

            // If we successfully parsed a legacy format, migrate it to new format
            if (isNaN(new Date(storedDate).getTime())) {
              // This was a legacy format, save it in new format
              const migratedJsDate = dateObj.toDate();
              localStorage.setItem(STORAGE_KEY, migratedJsDate.toISOString());
            }
          } else {
            // If stored date is invalid, treat as first visit
            const defaultDateObj = new DateObject(DEFAULT_DATE);
            setStartDate(defaultDateObj);
            setIsFirstVisit(true);
          }
        } catch (dateError) {
          console.error('Error parsing stored date:', dateError);
          // If parsing fails, treat as first visit
          const defaultDateObj = new DateObject(DEFAULT_DATE);
          setStartDate(defaultDateObj);
          setIsFirstVisit(true);
        }
      } else {
        // First visit, use default date but show modal
        const defaultDateObj = new DateObject(DEFAULT_DATE);
        setStartDate(defaultDateObj);
        setIsFirstVisit(true);
      }
    } catch (error) {
      console.error('Error loading stored date:', error);
      // Fallback to default date
      const defaultDateObj = new DateObject(DEFAULT_DATE);
      setStartDate(defaultDateObj);
      setIsFirstVisit(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveStartDate = (date: DateObject) => {
    try {
      // Ensure the date is valid before saving
      if (date && isValidDateObject(date)) {
        // Convert to JavaScript Date and store as ISO string for reliable parsing
        const jsDate = date.toDate();
        localStorage.setItem(STORAGE_KEY, jsDate.toISOString());
        setStartDate(date);
        setIsFirstVisit(false);
      } else {
        console.error('Invalid date provided to saveStartDate');
      }
    } catch (error) {
      console.error('Error saving date to localStorage:', error);
    }
  };

  const clearStoredDate = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const defaultDateObj = new DateObject(DEFAULT_DATE);
      setStartDate(defaultDateObj);
      setIsFirstVisit(true);
    } catch (error) {
      console.error('Error clearing stored date:', error);
    }
  };

  return {
    startDate,
    isFirstVisit,
    isLoading,
    saveStartDate,
    clearStoredDate,
  };
}
