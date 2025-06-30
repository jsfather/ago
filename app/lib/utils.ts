function gregorianToShamsi(gregorianDate: Date) {
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

export function getAgoFromShamsiDate(
    shamsiYear: number,
    shamsiMonth: number,
    shamsiDay: number,
    options?: { live?: boolean; onUpdate?: (result: { years: number; months: number; days: number }) => void }
): { years: number; months: number; days: number; stop?: () => void } {
  const jy = parseInt(shamsiYear.toString());
  const jm = parseInt(shamsiMonth.toString());
  const jd = parseInt(shamsiDay.toString());

  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) {
    throw new Error('Invalid date parameters. Please provide valid numbers.');
  }

  if (jm < 1 || jm > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  if (jd < 1 || jd > 31) {
    throw new Error('Day must be between 1 and 31');
  }

  const calculateDiff = () => {
    const today = new Date();
    const todayShamsi = gregorianToShamsi(today);

    let years = todayShamsi.year - jy;
    let months = todayShamsi.month - jm;
    let days = todayShamsi.day - jd;

    if (days < 0) {
      months--;
      const prevMonth = todayShamsi.month === 1 ? 12 : todayShamsi.month - 1;
      const prevYear =
          todayShamsi.month === 1 ? todayShamsi.year - 1 : todayShamsi.year;

      let daysInPrevMonth;
      if (prevMonth <= 6) {
        daysInPrevMonth = 31;
      } else if (prevMonth <= 11) {
        daysInPrevMonth = 30;
      } else {
        const isLeapYear = ((prevYear - 979) % 33) % 4 === 1;
        daysInPrevMonth = isLeapYear ? 30 : 29;
      }

      days += daysInPrevMonth;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const initial = calculateDiff();

  let stop: (() => void) | undefined = undefined;

  if (options?.live && typeof options.onUpdate === 'function') {
    const interval = setInterval(() => {
      const updated = calculateDiff();
      options.onUpdate!(updated);
    }, 1000);

    stop = () => clearInterval(interval);
  }

  return { ...initial, stop };
}

