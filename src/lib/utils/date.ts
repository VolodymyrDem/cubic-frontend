export function academicYearStart(d: Date = new Date()): Date {
  const year = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1; // вересень = 8
  return new Date(year, 8, 1); // 1 вересня
}

/** Рахуємо тиждень від понеділка, 0-й тиждень починається з понеділка тижня, де лежить 1 вересня */
export function weeksSinceStart(date = new Date()): number {
  const start = academicYearStart(date);
  const startMonday = start.getDay() === 0
    ? new Date(start.getFullYear(), start.getMonth(), start.getDate() - 6)
    : new Date(start.getFullYear(), start.getMonth(), start.getDate() - (start.getDay() - 1));
  const ms = date.setHours(0,0,0,0) - startMonday.setHours(0,0,0,0);
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

export function isEvenWeek(date = new Date()): boolean {
  return weeksSinceStart(date) % 2 === 0;
}
