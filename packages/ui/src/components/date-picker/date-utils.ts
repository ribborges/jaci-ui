export type DateLike = Date | null | undefined;

export type DatePickerGranularity = "day" | "month" | "date-time";

export function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

/** Creates a local date at noon to avoid DST changes moving a calendar day. */
export function createCalendarDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0, 0);
}

export function startOfMonth(date: Date): Date {
  return createCalendarDate(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, amount: number): Date {
  const result = cloneDate(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function addMonths(date: Date, amount: number): Date {
  return createCalendarDate(date.getFullYear(), date.getMonth() + amount, 1);
}

export function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toInputDate(date: DateLike): string {
  return date ? dateKey(date) : "";
}

export function toInputMonth(date: DateLike): string {
  return date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` : "";
}

export function toInputDateTime(date: DateLike): string {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${dateKey(date)}T${hours}:${minutes}`;
}

export function isSameDay(left: DateLike, right: DateLike): boolean {
  return Boolean(left && right && dateKey(left) === dateKey(right));
}

export function isBeforeDay(left: Date, right: Date): boolean {
  return dateKey(left) < dateKey(right);
}

export function isAfterDay(left: Date, right: Date): boolean {
  return dateKey(left) > dateKey(right);
}

export function getCalendarDays(month: Date, weekStartsOn: number): Date[] {
  const firstDay = startOfMonth(month);
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const firstVisibleDay = addDays(firstDay, -offset);

  return Array.from({ length: 42 }, (_, index) => addDays(firstVisibleDay, index));
}

export function getWeekdayLabels(locale: string, weekStartsOn: number): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const sunday = createCalendarDate(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(sunday, (weekStartsOn + index) % 7)),
  );
}

export function formatMonthLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
}

export function formatDateLabel(
  date: DateLike,
  locale: string,
  placeholder: string,
  granularity: DatePickerGranularity = "day",
): string {
  if (!date) return placeholder;
  if (granularity === "month") {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
  }
  if (granularity === "date-time") {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function getMonthLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, month) =>
    formatter.format(createCalendarDate(2024, month, 1)),
  );
}

export function toTimeInput(date: DateLike): string {
  if (!date) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function getDateRangeLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
