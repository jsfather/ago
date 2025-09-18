'use client';

import { useState, useEffect } from 'react';
import { DateObject } from 'react-multi-date-picker';

const STORAGE_KEY = 'ago_date_range';
const DEFAULT_START_DATE = '2025-02-19';

// Helper function to validate DateObject
const isValidDateObject = (dateObj: DateObject): boolean => {
  try {
    const jsDate = dateObj.toDate();
    return jsDate instanceof Date && !isNaN(jsDate.getTime());
  } catch (error) {
    console.log('Error validating DateObject:', error);
    return false;
  }
};

// Helper function to validate that end date is not before today
const validateEndDate = (endDate: DateObject): boolean => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const endDateJs = endDate.toDate();
    endDateJs.setHours(0, 0, 0, 0); // Set to start of the end date
    return endDateJs >= today;
  } catch (error) {
    console.log('Error validating end date:', error);
    return false;
  }
};

// Helper function to parse stored date range
const parseStoredDateRange = (storedRange: string): DateObject[] | null => {
  try {
    const parsed = JSON.parse(storedRange);
    
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    const dateObjects: DateObject[] = [];
    
    for (const dateStr of parsed) {
      const jsDate = new Date(dateStr);
      if (!isNaN(jsDate.getTime())) {
        const dateObj = new DateObject(jsDate);
        if (isValidDateObject(dateObj)) {
          dateObjects.push(dateObj);
        }
      }
    }

    return dateObjects.length > 0 ? dateObjects : null;
  } catch (error) {
    console.log('Error parsing stored date range:', error);
    return null;
  }
};

export function useStoredDateRange() {
  const [dateRange, setDateRange] = useState<DateObject[] | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;

    try {
      const storedRange = localStorage.getItem(STORAGE_KEY);

      if (storedRange) {
        // User has visited before, load their stored date range
        const parsedRange = parseStoredDateRange(storedRange);
        
        if (parsedRange && parsedRange.length > 0) {
          setDateRange(parsedRange);
          setIsFirstVisit(false);
        } else {
          // If stored range is invalid, treat as first visit
          const defaultDateObj = new DateObject(DEFAULT_START_DATE);
          setDateRange([defaultDateObj]);
          setIsFirstVisit(true);
        }
      } else {
        // First visit, use default date but show modal
        const defaultDateObj = new DateObject(DEFAULT_START_DATE);
        setDateRange([defaultDateObj]);
        setIsFirstVisit(true);
      }
    } catch (error) {
      console.error('Error loading stored date range:', error);
      // Fallback to default date
      const defaultDateObj = new DateObject(DEFAULT_START_DATE);
      setDateRange([defaultDateObj]);
      setIsFirstVisit(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveDateRange = (range: DateObject[]) => {
    try {
      // Validate the range
      if (!range || range.length === 0) {
        console.error('Invalid empty date range provided');
        return false;
      }

      // Validate all dates in the range
      for (const date of range) {
        if (!isValidDateObject(date)) {
          console.error('Invalid date in range');
          return false;
        }
      }

      // If there's an end date (range has 2 dates), validate that it's not before today
      if (range.length === 2) {
        const endDate = range[1];
        if (!validateEndDate(endDate)) {
          console.error('End date cannot be before today');
          return false;
        }
      }

      // Convert to JavaScript Dates and store as ISO strings
      const isoDates = range.map(date => date.toDate().toISOString());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isoDates));
      setDateRange(range);
      setIsFirstVisit(false);
      return true;
    } catch (error) {
      console.error('Error saving date range to localStorage:', error);
      return false;
    }
  };

  const updateStartDate = (startDate: DateObject) => {
    try {
      if (!isValidDateObject(startDate)) {
        console.error('Invalid start date provided');
        return false;
      }

      const newRange = dateRange && dateRange.length > 1 
        ? [startDate, dateRange[1]] 
        : [startDate];
      
      return saveDateRange(newRange);
    } catch (error) {
      console.error('Error updating start date:', error);
      return false;
    }
  };

  const clearStoredDateRange = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const defaultDateObj = new DateObject(DEFAULT_START_DATE);
      setDateRange([defaultDateObj]);
      setIsFirstVisit(true);
    } catch (error) {
      console.error('Error clearing stored date range:', error);
    }
  };

  // Get the start date (first date in range)
  const startDate = dateRange && dateRange.length > 0 ? dateRange[0] : null;

  return {
    dateRange,
    startDate,
    isFirstVisit,
    isLoading,
    saveDateRange,
    updateStartDate,
    clearStoredDateRange,
    validateEndDate,
  };
}