/** 格式化为 YYYY-MM-DD */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 计算两个日期相差的天数 */
export function daysBetween(a: string | Date, b: string | Date): number {
  const da = typeof a === 'string' ? new Date(a) : a;
  const db = typeof b === 'string' ? new Date(b) : b;
  return Math.floor((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

/** 判断日期是否在最近 N 天内 */
export function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  return daysBetween(d, new Date()) <= days;
}
