function gregorianToShamsi(gregorianDate: Date) {
  if (isNaN(gregorianDate.getTime())) {
    throw new Error('Invalid date provided to gregorianToShamsi');
  }

  const gy = gregorianDate.getFullYear();
  const gm = gregorianDate.getMonth() + 1;
  const gd = gregorianDate.getDate();

  let jy, jm, jd;
  let gy2;

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

  let jy_base, gy_base;
  if (gy <= 1600) {
    jy_base = 0;
    gy_base = gy - 621;
  } else {
    jy_base = 979;
    gy_base = gy - 1600;
  }

  if (gm > 2) {
    gy2 = gy_base + 1;
  } else {
    gy2 = gy_base;
  }

  let days =
    365 * gy_base +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];

  jy = jy_base + 33 * Math.floor(days / 12053);
  days = days % 12053;

  jy += 4 * Math.floor(days / 1461);
  days = days % 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }

  return { year: jy, month: jm, day: jd };
}

function createLiveUpdater(
  calculate: () => { years: number; months: number; days: number },
  onUpdate: (result: { years: number; months: number; days: number }) => void
): () => void {
  const interval = setInterval(() => {
    onUpdate(calculate());
  }, 1000);

  return () => clearInterval(interval);
}

export function getDateDifference(
  startDate: Date | string,
  endDate: Date | string,
  options?: {
    live?: boolean;
    onUpdate?: (result: {
      years: number;
      months: number;
      days: number;
    }) => void;
  }
): { years: number; months: number; days: number; stop?: () => void } {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(
      'Invalid date provided. Please provide valid Date objects or date strings.'
    );
  }

  const calculate = () => {
    const startShamsi = gregorianToShamsi(start);
    const endShamsi = gregorianToShamsi(end);

    let years = endShamsi.year - startShamsi.year;
    let months = endShamsi.month - startShamsi.month;
    let days = endShamsi.day - startShamsi.day;

    if (days < 0) {
      months--;
      const prevMonth = endShamsi.month === 1 ? 12 : endShamsi.month - 1;
      const prevYear =
        endShamsi.month === 1 ? endShamsi.year - 1 : endShamsi.year;

      const isLeapYear = ((prevYear - 979) % 33) % 4 === 1;
      const daysInPrevMonth =
        prevMonth <= 6 ? 31 : prevMonth <= 11 ? 30 : isLeapYear ? 30 : 29;

      days += daysInPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const result = calculate();
  const stop =
    options?.live && options.onUpdate
      ? createLiveUpdater(calculate, options.onUpdate)
      : undefined;

  return { ...result, stop };
}

export function getAgoFromDate(
  startDate: Date | string,
  options?: {
    live?: boolean;
    onUpdate?: (result: {
      years: number;
      months: number;
      days: number;
    }) => void;
  }
): { years: number; months: number; days: number; stop?: () => void } {
  return getDateDifference(startDate, new Date(), options);
}
