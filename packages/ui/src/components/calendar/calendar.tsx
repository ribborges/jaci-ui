"use client";

import { forwardRef, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { calendar } from "../../styled-system/recipes";
import {
  addDays,
  addMonths,
  createCalendarDate,
  dateKey,
  formatMonthLabel,
  getCalendarDays,
  getWeekdayLabels,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  startOfMonth,
} from "../date-picker/date-utils";

export interface CalendarYearRange {
  start: number;
  end: number;
}

export interface CalendarRootProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children" | "defaultValue" | "value"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  referenceDate?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  yearRange?: CalendarYearRange;
  disabled?: boolean;
  children?: ReactNode;
}

interface CalendarContextValue {
  calendarId: string;
  dateDisabled: (date: Date) => boolean;
  disabled: boolean;
  focusedDate: Date;
  focusDate: (date: Date, direction?: number) => void;
  locale: string;
  month: Date;
  monthDisabled: (date: Date) => boolean;
  onSelect: (date: Date) => void;
  selected: Date | null;
  setMonth: (date: Date) => void;
  styles: ReturnType<typeof calendar>;
  today: Date;
  weekStartsOn: number;
  yearRange: CalendarYearRange;
  canNavigate: (amount: number) => boolean;
  selectMonth: (month: number) => void;
  selectYear: (year: number) => void;
  registerDay: (key: string, node: HTMLButtonElement | null) => void;
}

import { createContext, useContext } from "react";

const CalendarContext = createContext<CalendarContextValue | null>(null);

function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("Calendar parts must be rendered inside Calendar.Root.");
  return context;
}

function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export const CalendarRoot = forwardRef<HTMLElement, CalendarRootProps>(function CalendarRoot(
  {
    children,
    className,
    defaultValue = null,
    disabled = false,
    isDateDisabled,
    locale = "pt-BR",
    maxDate,
    minDate,
    onValueChange,
    referenceDate,
    value: controlledValue,
    weekStartsOn = 0,
    yearRange: configuredYearRange,
    ...props
  },
  ref,
) {
  const initialDate = controlledValue ?? defaultValue ?? referenceDate ?? new Date();
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue);
  const selected = controlledValue === undefined ? uncontrolledValue : controlledValue;
  const [month, setMonthState] = useState(() => startOfMonth(initialDate));
  const [focusedDate, setFocusedDate] = useState(selected ?? initialDate);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const calendarId = useId();
  const styles = calendar();
  const today = useMemo(
    () =>
      createCalendarDate(
        (referenceDate ?? new Date()).getFullYear(),
        (referenceDate ?? new Date()).getMonth(),
        (referenceDate ?? new Date()).getDate(),
      ),
    [referenceDate],
  );
  const minMonth = minDate ? startOfMonth(minDate) : undefined;
  const maxMonth = maxDate ? startOfMonth(maxDate) : undefined;
  const yearRange = useMemo(() => {
    const start = configuredYearRange?.start ?? today.getFullYear() - 100;
    const end = configuredYearRange?.end ?? today.getFullYear() + 20;
    const years = [selected?.getFullYear(), minDate?.getFullYear(), maxDate?.getFullYear()].filter(
      (year): year is number => year !== undefined,
    );
    return { start: Math.min(start, end, ...years), end: Math.max(start, end, ...years) };
  }, [configuredYearRange?.end, configuredYearRange?.start, maxDate, minDate, selected, today]);

  const dateDisabled = useCallback(
    (date: Date) =>
      Boolean(
        (minDate && isBeforeDay(date, minDate)) ||
          (maxDate && isAfterDay(date, maxDate)) ||
          isDateDisabled?.(date),
      ),
    [isDateDisabled, maxDate, minDate],
  );
  const monthDisabled = useCallback(
    (date: Date) => {
      const first = startOfMonth(date);
      const last = createCalendarDate(date.getFullYear(), date.getMonth() + 1, 0);
      return Boolean(
        (minDate && isBeforeDay(last, minDate)) || (maxDate && isAfterDay(first, maxDate)),
      );
    },
    [maxDate, minDate],
  );
  const clampMonth = useCallback(
    (date: Date) => {
      const normalized = startOfMonth(date);
      if (minMonth && isBeforeDay(normalized, minMonth)) return minMonth;
      if (maxMonth && isAfterDay(normalized, maxMonth)) return maxMonth;
      return normalized;
    },
    [maxMonth, minMonth],
  );
  const setMonth = useCallback((date: Date) => setMonthState(clampMonth(date)), [clampMonth]);
  const canNavigate = useCallback(
    (amount: number) => {
      const next = addMonths(month, amount);
      return (
        !(minMonth && isBeforeDay(next, minMonth)) && !(maxMonth && isAfterDay(next, maxMonth))
      );
    },
    [maxMonth, minMonth, month],
  );
  const setValue = useCallback(
    (nextValue: Date | null) => {
      if (controlledValue === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [controlledValue, onValueChange],
  );
  const onSelect = useCallback(
    (date: Date) => {
      if (disabled || dateDisabled(date)) return;
      const next = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
      setValue(next);
      setFocusedDate(next);
      setMonth(next);
    },
    [dateDisabled, disabled, setMonth, setValue],
  );
  const focusDate = useCallback(
    (date: Date, direction = 1) => {
      let next = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
      const step = direction < 0 ? -1 : 1;
      let attempts = 0;
      while (dateDisabled(next) && attempts < 366) {
        next = addDays(next, step);
        attempts += 1;
      }
      setFocusedDate(next);
      setMonth(next);
      const focusTarget = () => dayRefs.current.get(dateKey(next))?.focus();
      focusTarget();
      queueMicrotask(focusTarget);
    },
    [dateDisabled, setMonth],
  );
  const selectMonth = useCallback(
    (monthIndex: number) => setMonth(createCalendarDate(month.getFullYear(), monthIndex, 1)),
    [month, setMonth],
  );
  const selectYear = useCallback(
    (year: number) => setMonth(createCalendarDate(year, month.getMonth(), 1)),
    [month, setMonth],
  );
  const registerDay = useCallback((key: string, node: HTMLButtonElement | null) => {
    if (node) dayRefs.current.set(key, node);
    else dayRefs.current.delete(key);
  }, []);

  useEffect(() => {
    if (!selected) return;
    setFocusedDate(selected);
    setMonthState((current) => (sameMonth(current, selected) ? current : clampMonth(selected)));
  }, [clampMonth, selected]);

  const context: CalendarContextValue = {
    calendarId,
    canNavigate,
    dateDisabled,
    disabled,
    focusedDate,
    focusDate,
    locale,
    month,
    monthDisabled,
    onSelect,
    registerDay,
    selected,
    selectMonth,
    selectYear,
    setMonth,
    styles,
    today,
    weekStartsOn,
    yearRange,
  };

  return (
    <CalendarContext.Provider value={context}>
      <section
        {...props}
        aria-label={props["aria-label"] ?? formatMonthLabel(month, locale)}
        className={cx(styles.root, className)}
        data-jaci-component="calendar"
        data-slot="calendar"
        ref={ref}
      >
        {children ?? (
          <>
            <CalendarHeader>
              <CalendarPrevious />
              <CalendarCaption />
              <CalendarNext />
            </CalendarHeader>
            <CalendarGrid />
          </>
        )}
      </section>
    </CalendarContext.Provider>
  );
});

export type CalendarHeaderProps = ComponentPropsWithoutRef<"div">;
export const CalendarHeader = forwardRef<HTMLDivElement, CalendarHeaderProps>(
  function CalendarHeader({ className, ...props }, ref) {
    const { styles } = useCalendarContext();
    return (
      <div
        {...props}
        className={cx(styles.header, className)}
        data-slot="calendar-header"
        ref={ref}
      />
    );
  },
);

export type CalendarCaptionProps = ComponentPropsWithoutRef<"span">;
export const CalendarCaption = forwardRef<HTMLSpanElement, CalendarCaptionProps>(
  function CalendarCaption({ children, className, ...props }, ref) {
    const { locale, month, styles } = useCalendarContext();
    return (
      <span
        {...props}
        className={cx(styles.caption, className)}
        data-slot="calendar-caption"
        ref={ref}
      >
        {children ?? formatMonthLabel(month, locale)}
      </span>
    );
  },
);

export interface CalendarNavigationProps extends ComponentPropsWithoutRef<"button"> {
  amount?: number;
}

const CalendarNavigationButton = forwardRef<HTMLButtonElement, CalendarNavigationProps>(
  function CalendarNavigationButton({ amount = 1, children, className, onClick, ...props }, ref) {
    const { canNavigate, month, setMonth, styles } = useCalendarContext();
    const isDisabled = props.disabled || !canNavigate(amount);
    return (
      <button
        {...props}
        aria-label={props["aria-label"] ?? (amount < 0 ? "Previous month" : "Next month")}
        className={cx(styles.navigation, className)}
        data-slot={amount < 0 ? "calendar-previous" : "calendar-next"}
        disabled={isDisabled}
        onClick={(event) => {
          if (!isDisabled) setMonth(addMonths(month, amount));
          onClick?.(event);
        }}
        ref={ref}
        type="button"
      >
        {children ?? (amount < 0 ? "‹" : "›")}
      </button>
    );
  },
);

export const CalendarPrevious = forwardRef<HTMLButtonElement, CalendarNavigationProps>(
  function CalendarPrevious(props, ref) {
    return <CalendarNavigationButton {...props} amount={-1} ref={ref} />;
  },
);
export const CalendarNext = forwardRef<HTMLButtonElement, CalendarNavigationProps>(
  function CalendarNext(props, ref) {
    return <CalendarNavigationButton {...props} amount={1} ref={ref} />;
  },
);

export type CalendarMonthSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;
export const CalendarMonthSelect = forwardRef<HTMLSelectElement, CalendarMonthSelectProps>(
  function CalendarMonthSelect({ className, ...props }, ref) {
    const { locale, month, monthDisabled, selectMonth, styles } = useCalendarContext();
    const labels = Array.from({ length: 12 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { month: "long" }).format(createCalendarDate(2024, index, 1)),
    );
    return (
      <select
        {...props}
        aria-label={props["aria-label"] ?? "Select month"}
        className={cx(styles.monthSelect, className)}
        data-slot="calendar-month-select"
        onChange={(event) => selectMonth(Number(event.currentTarget.value))}
        ref={ref}
        value={month.getMonth()}
      >
        {labels.map((label, index) => (
          <option
            disabled={monthDisabled(createCalendarDate(month.getFullYear(), index, 1))}
            key={label}
            value={index}
          >
            {label}
          </option>
        ))}
      </select>
    );
  },
);

export type CalendarYearSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;
export const CalendarYearSelect = forwardRef<HTMLSelectElement, CalendarYearSelectProps>(
  function CalendarYearSelect({ className, ...props }, ref) {
    const { month, monthDisabled, selectYear, styles, yearRange } = useCalendarContext();
    const years = Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, index) => yearRange.start + index,
    );
    return (
      <select
        {...props}
        aria-label={props["aria-label"] ?? "Select year"}
        className={cx(styles.yearSelect, className)}
        data-slot="calendar-year-select"
        onChange={(event) => selectYear(Number(event.currentTarget.value))}
        ref={ref}
        value={month.getFullYear()}
      >
        {years.map((year) => (
          <option
            disabled={monthDisabled(createCalendarDate(year, month.getMonth(), 1))}
            key={year}
            value={year}
          >
            {year}
          </option>
        ))}
      </select>
    );
  },
);

export interface CalendarDayProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  date: Date;
}

export const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(function CalendarDay(
  { children, className, date, disabled, onClick, onKeyDown, ...props },
  ref,
) {
  const {
    dateDisabled,
    disabled: calendarDisabled,
    focusDate,
    focusedDate,
    locale,
    month,
    onSelect,
    registerDay,
    selected,
    styles,
    today,
    weekStartsOn,
  } = useCalendarContext();
  const key = dateKey(date);
  const outsideMonth = !sameMonth(date, month);
  const isDisabled = Boolean(disabled || calendarDisabled || dateDisabled(date));
  const isSelected = isSameDay(date, selected);
  const isFocused = isSameDay(date, focusedDate);
  const isToday = isSameDay(date, today);
  return (
    // biome-ignore lint/a11y/useSemanticElements: the roving button is the interactive grid cell.
    <button
      {...props}
      aria-label={
        props["aria-label"] ?? new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date)
      }
      aria-current={isToday ? "date" : undefined}
      aria-selected={isSelected}
      className={cx(styles.day, className)}
      data-date={key}
      data-disabled={isDisabled || undefined}
      data-outside-month={outsideMonth || undefined}
      data-selected={isSelected || undefined}
      data-slot="calendar-day"
      data-today={isToday || undefined}
      disabled={isDisabled}
      onClick={(event) => {
        onSelect(date);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        if (!event.defaultPrevented) {
          let nextDate: Date | undefined;
          switch (event.key) {
            case "ArrowLeft":
              nextDate = addDays(date, -1);
              break;
            case "ArrowRight":
              nextDate = addDays(date, 1);
              break;
            case "ArrowUp":
              nextDate = addDays(date, -7);
              break;
            case "ArrowDown":
              nextDate = addDays(date, 7);
              break;
            case "Home":
              nextDate = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
              break;
            case "End":
              nextDate = addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7));
              break;
            case "PageUp":
              nextDate = addMonths(date, event.shiftKey ? -12 : -1);
              break;
            case "PageDown":
              nextDate = addMonths(date, event.shiftKey ? 12 : 1);
              break;
            case "Enter":
            case " ":
              if (!isDisabled) {
                event.preventDefault();
                onSelect(date);
              }
              break;
          }
          if (nextDate) {
            event.preventDefault();
            focusDate(nextDate, nextDate < date ? -1 : 1);
          }
        }
        onKeyDown?.(event);
      }}
      ref={(node) => {
        registerDay(key, node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="gridcell"
      tabIndex={isFocused && !isDisabled ? 0 : -1}
      type="button"
    >
      {children ?? date.getDate()}
    </button>
  );
});

export interface CalendarGridProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  "aria-label"?: string;
}

export const CalendarGrid = forwardRef<HTMLDivElement, CalendarGridProps>(function CalendarGrid(
  { "aria-label": ariaLabel, className, ...props },
  ref,
) {
  const { locale, month, styles, weekStartsOn } = useCalendarContext();
  const days = useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
  const weeks = useMemo(
    () =>
      Array.from({ length: Math.ceil(days.length / 7) }, (_, index) =>
        days.slice(index * 7, index * 7 + 7),
      ),
    [days],
  );
  const weekdays = useMemo(() => getWeekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
  return (
    <div {...props} className={cx(styles.calendar, className)} data-slot="calendar-grid" ref={ref}>
      <div aria-hidden="true" className={styles.weekdays} data-slot="calendar-weekdays">
        {weekdays.map((weekday) => (
          <span className={styles.weekday} data-slot="calendar-weekday" key={weekday}>
            {weekday}
          </span>
        ))}
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: the calendar uses the ARIA grid pattern. */}
      <div
        aria-label={ariaLabel ?? formatMonthLabel(month, locale)}
        className={styles.grid}
        data-slot="calendar-day-grid"
        role="grid"
      >
        {weeks.map((week, index) => (
          // biome-ignore lint/a11y/useSemanticElements: Calendar rows use ARIA grid semantics while the day controls remain buttons.
          <div
            aria-rowindex={index + 1}
            className={styles.row}
            data-slot="calendar-week"
            key={week.map(dateKey).join("-")}
            role="row"
            tabIndex={-1}
          >
            {week.map((date) => (
              <CalendarDay date={date} key={dateKey(date)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export const Calendar = {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Caption: CalendarCaption,
  Previous: CalendarPrevious,
  Next: CalendarNext,
  MonthSelect: CalendarMonthSelect,
  YearSelect: CalendarYearSelect,
  Grid: CalendarGrid,
  Day: CalendarDay,
};
