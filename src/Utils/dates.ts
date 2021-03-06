import {
  closestTo,
  isBefore,
  startOfToday,
  parseJSON,
  getDay,
  differenceInDays,
  getYear,
  format,
  compareAsc,
  isToday,
  getMonth,
  isDate,
  nextDay,
} from 'date-fns';

export const todayDate = startOfToday();
// const todayDay = getDay(todayDate);

const dayName = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const monthName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getNextDate = (dates: string[]): string => {
  if (dates.length <= 0) return '';

  const ds: Date[] = dates
    .filter((date) => !isBefore(parseJSON(date), todayDate))
    .map((date) => parseJSON(date));

  return ds.length > 0 ? closestTo(todayDate, ds).toJSON() : '';
};

export const dayToNextDates = (dates: string[]): string[] => {
  return dates.map((day) => {
    const d = Number(day);
    return nextDay(todayDate, d as Day).toJSON();
  });
};

export const getDisplayDate = (date: string): string => {
  const day = parseJSON(date);
  if (isToday(day)) return 'Today';

  const dif = Math.abs(differenceInDays(todayDate, day));
  if (dif <= 6) return dayName[getDay(day)];

  const yDif = Math.abs(getYear(day) - getYear(todayDate));
  return yDif >= 1 ? format(day, 'dd/MMM/yyy') : format(day, 'MMM, do');
};

export const compAscDates = (a: string, b: string): number =>
  compareAsc(parseJSON(a), parseJSON(b));

export const dateIsToday = (date: string): boolean => isToday(parseJSON(date));

export const getMonthName = (date: Date): string =>
  monthName[getMonth(date) - 1];

export const dayNameToNumber = (day: string): string => {
  let dayIndex = dayName.findIndex((d) => d.includes(day));
  if (dayIndex < 0) {
    dayIndex = getDay(parseJSON(day));
  }
  return String(dayIndex);
};

export const getWeekDay = (date: string): string => {
  const day = parseJSON(date);
  return dayName[getDay(day)];
};

export const getClosestDate = (dates: string[] | Date[]): Date => {
  const datesArray: Date[] = dates.map((date) =>
    isDate(date) ? (date as Date) : parseJSON(date),
  );

  return closestTo(todayDate, datesArray);
};
