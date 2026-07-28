"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { PopoverRoot as BasePopoverRoot } from "@base-ui/react/popover";

import { cx } from "../../styled-system/css";
import { dateRangePicker } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";
import {
  addDays,
  addMonths,
  createCalendarDate,
  dateKey,
  formatDateLabel,
  formatMonthLabel,
  getCalendarDays,
  getMonthLabels,
  getWeekdayLabels,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  startOfMonth,
  toInputDate,
} from "../date-picker/date-utils";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerYearRange {
  start: number;
  end: number;
}

export interface DateRangePickerRootProps extends Omit<BasePopoverRoot.Props, "children"> {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  referenceDate?: Date;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  yearRange?: DateRangePickerYearRange;
  closeOnSelect?: boolean;
  name?: string;
  disabled?: boolean;
  placeholder?: ReactNode;
  children?: ReactNode;
}

interface DateRangePickerContextValue {
  canNavigate: (amount: number) => boolean;
  close: () => void;
  dateDisabled: (date: Date) => boolean;
  disabled: boolean;
  focusDate: (date: Date, direction?: number) => void;
  focusedDate: Date;
  hoveredDate: Date | null;
  locale: string;
  maxDate: Date | undefined;
  minDate: Date | undefined;
  month: Date;
  monthDisabled: (date: Date) => boolean;
  onSelect: (date: Date) => void;
  range: DateRange;
  selectMonth: (month: number) => void;
  selectYear: (year: number) => void;
  setMonth: (date: Date) => void;
  setHoveredDate: (date: Date | null) => void;
  setRange: (range: DateRange) => void;
  styles: ReturnType<typeof dateRangePicker>;
  today: Date;
  triggerId: string;
  weekStartsOn: number;
  yearRange: DateRangePickerYearRange;
  registerDay: (key: string, node: HTMLButtonElement | null) => void;
}

const DateRangePickerContext = createContext<DateRangePickerContextValue | null>(null);

function useDateRangePickerContext() {
  const context = useContext(DateRangePickerContext);
  if (!context)
    throw new Error("DateRangePicker parts must be rendered inside DateRangePicker.Root.");
  return context;
}

function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function dateInRange(date: Date, range: DateRange, preview: Date | null) {
  const end = range.end ?? preview;
  return Boolean(range.start && end && !isBeforeDay(date, range.start) && !isAfterDay(date, end));
}

export function DateRangePickerRoot({
  children,
  closeOnSelect = true,
  defaultValue = { start: null, end: null },
  disabled = false,
  isDateDisabled,
  locale = "pt-BR",
  maxDate,
  minDate,
  name,
  onValueChange,
  referenceDate,
  value: controlledValue,
  weekStartsOn = 0,
  yearRange: configuredYearRange,
  ...popoverProps
}: DateRangePickerRootProps) {
  const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>(defaultValue);
  const range = controlledValue ?? uncontrolledRange;
  const initialDate = range.start ?? referenceDate ?? new Date();
  const [month, setMonthState] = useState(() => startOfMonth(initialDate));
  const [focusedDate, setFocusedDate] = useState(range.start ?? initialDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const actionsRef = useRef<BasePopoverRoot.Actions | null>(null);
  const triggerId = useId();
  const styles = dateRangePicker();
  const today = useMemo(() => referenceDate ?? new Date(), [referenceDate]);
  const minMonth = minDate ? startOfMonth(minDate) : undefined;
  const maxMonth = maxDate ? startOfMonth(maxDate) : undefined;
  const yearRange = useMemo(() => {
    const start = configuredYearRange?.start ?? today.getFullYear() - 100;
    const end = configuredYearRange?.end ?? today.getFullYear() + 20;
    const years = [
      range.start?.getFullYear(),
      range.end?.getFullYear(),
      minDate?.getFullYear(),
      maxDate?.getFullYear(),
    ].filter((year): year is number => year !== undefined);
    return { start: Math.min(start, end, ...years), end: Math.max(start, end, ...years) };
  }, [
    configuredYearRange?.end,
    configuredYearRange?.start,
    maxDate,
    minDate,
    range.end,
    range.start,
    today,
  ]);

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
  const setRange = useCallback(
    (nextRange: DateRange) => {
      if (controlledValue === undefined) setUncontrolledRange(nextRange);
      onValueChange?.(nextRange);
    },
    [controlledValue, onValueChange],
  );
  const close = useCallback(() => actionsRef.current?.close(), []);
  const onSelect = useCallback(
    (date: Date) => {
      if (disabled || dateDisabled(date)) return;
      const nextDate = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
      let nextRange: DateRange;
      if (!range.start || range.end) nextRange = { start: nextDate, end: null };
      else if (isBeforeDay(nextDate, range.start)) nextRange = { start: nextDate, end: null };
      else nextRange = { start: range.start, end: nextDate };
      setRange(nextRange);
      setFocusedDate(nextDate);
      setMonth(nextDate);
      setHoveredDate(null);
      if (nextRange.start && nextRange.end && closeOnSelect) close();
    },
    [close, closeOnSelect, dateDisabled, disabled, range.end, range.start, setMonth, setRange],
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
    const selected = range.end ?? range.start;
    if (!selected) return;
    setFocusedDate(selected);
    setMonthState((current) => (sameMonth(current, selected) ? current : clampMonth(selected)));
  }, [clampMonth, range.end, range.start]);

  const context: DateRangePickerContextValue = {
    canNavigate,
    close,
    dateDisabled,
    disabled,
    focusDate,
    focusedDate,
    hoveredDate,
    locale,
    maxDate,
    minDate,
    month,
    monthDisabled,
    onSelect,
    range,
    registerDay,
    selectMonth,
    selectYear,
    setHoveredDate,
    setMonth,
    setRange,
    styles,
    today,
    triggerId,
    weekStartsOn,
    yearRange,
  };

  return (
    <DateRangePickerContext.Provider value={context}>
      <BasePopover.Root {...popoverProps} actionsRef={actionsRef}>
        {children}
      </BasePopover.Root>
      {name ? (
        <>
          <input
            disabled={disabled}
            name={`${name}[start]`}
            type="hidden"
            value={toInputDate(range.start)}
          />
          <input
            disabled={disabled}
            name={`${name}[end]`}
            type="hidden"
            value={toInputDate(range.end)}
          />
        </>
      ) : null}
    </DateRangePickerContext.Provider>
  );
}

export type DateRangePickerLabelProps = ComponentPropsWithoutRef<"label">;
export const DateRangePickerLabel = forwardRef<HTMLLabelElement, DateRangePickerLabelProps>(
  function DateRangePickerLabel({ className, ...props }, ref) {
    const { styles, triggerId } = useDateRangePickerContext();
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: the consumer renders the trigger/control in this composition.
      <label
        {...props}
        className={cx(styles.label, className)}
        data-slot="date-range-picker-label"
        htmlFor={props.htmlFor ?? triggerId}
        ref={ref}
      />
    );
  },
);

export type DateRangePickerControlProps = ComponentPropsWithoutRef<"div">;
export const DateRangePickerControl = forwardRef<HTMLDivElement, DateRangePickerControlProps>(
  function DateRangePickerControl({ className, ...props }, ref) {
    const { styles } = useDateRangePickerContext();
    return (
      <div
        {...props}
        className={cx(styles.control, className)}
        data-slot="date-range-picker-control"
        ref={ref}
      />
    );
  },
);

export type DateRangePickerTriggerProps = ComponentPropsWithoutRef<typeof BasePopover.Trigger>;
export const DateRangePickerTrigger = forwardRef<HTMLButtonElement, DateRangePickerTriggerProps>(
  function DateRangePickerTrigger({ children, className, disabled, id, ...props }, ref) {
    const { disabled: pickerDisabled, styles, triggerId } = useDateRangePickerContext();
    return (
      <BasePopover.Trigger
        {...props}
        aria-label={props["aria-label"] ?? "Choose date range"}
        className={withRecipeClassName(styles.trigger, className)}
        data-jaci-component="date-range-picker"
        data-slot="date-range-picker-trigger"
        disabled={disabled ?? pickerDisabled}
        id={id ?? triggerId}
        ref={ref}
      >
        {children ?? (
          <>
            <DateRangePickerValue />
            <span aria-hidden="true">▾</span>
          </>
        )}
      </BasePopover.Trigger>
    );
  },
);

export interface DateRangePickerValueProps extends ComponentPropsWithoutRef<"span"> {
  placeholder?: ReactNode;
}
export const DateRangePickerValue = forwardRef<HTMLSpanElement, DateRangePickerValueProps>(
  function DateRangePickerValue({ children, className, placeholder, ...props }, ref) {
    const { locale, range, styles } = useDateRangePickerContext();
    const value =
      children ??
      (range.start && range.end
        ? `${formatDateLabel(range.start, locale, "")} – ${formatDateLabel(range.end, locale, "")}`
        : range.start
          ? `${formatDateLabel(range.start, locale, "")} – …`
          : (placeholder ?? "Select a date range"));
    return (
      <span
        {...props}
        className={cx(styles.value, className)}
        data-placeholder={range.start ? undefined : "true"}
        data-slot="date-range-picker-value"
        ref={ref}
      >
        {value}
      </span>
    );
  },
);

export type DateRangePickerClearProps = ComponentPropsWithoutRef<"button">;
export const DateRangePickerClear = forwardRef<HTMLButtonElement, DateRangePickerClearProps>(
  function DateRangePickerClear({ children = "×", className, disabled, onClick, ...props }, ref) {
    const {
      disabled: pickerDisabled,
      range,
      setRange,
      styles,
      close,
    } = useDateRangePickerContext();
    return (
      <button
        {...props}
        aria-label={props["aria-label"] ?? "Clear date range"}
        className={cx(styles.clear, className)}
        data-slot="date-range-picker-clear"
        disabled={disabled || pickerDisabled || (!range.start && !range.end)}
        onClick={(event) => {
          setRange({ start: null, end: null });
          close();
          onClick?.(event);
        }}
        ref={ref}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export type DateRangePickerPortalProps = ComponentPropsWithoutRef<typeof BasePopover.Portal>;
export function DateRangePickerPortal(props: DateRangePickerPortalProps) {
  return <BasePopover.Portal {...useThemePortalProps(props)} />;
}
export type DateRangePickerPositionerProps = ComponentPropsWithoutRef<
  typeof BasePopover.Positioner
>;
export const DateRangePickerPositioner = forwardRef<HTMLDivElement, DateRangePickerPositionerProps>(
  function DateRangePickerPositioner({ className, ...props }, ref) {
    const { styles } = useDateRangePickerContext();
    return (
      <BasePopover.Positioner
        {...props}
        className={withRecipeClassName(styles.positioner, className)}
        data-slot="date-range-picker-positioner"
        ref={ref}
      />
    );
  },
);
export type DateRangePickerPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;
export const DateRangePickerPopup = forwardRef<HTMLDivElement, DateRangePickerPopupProps>(
  function DateRangePickerPopup({ className, ...props }, ref) {
    const { styles } = useDateRangePickerContext();
    return (
      <BasePopover.Popup
        {...props}
        aria-label={props["aria-label"] ?? "Calendar"}
        className={withRecipeClassName(styles.popup, className)}
        data-slot="date-range-picker-popup"
        ref={ref}
      />
    );
  },
);
export type DateRangePickerCloseProps = ComponentPropsWithoutRef<typeof BasePopover.Close>;
export const DateRangePickerClose = forwardRef<HTMLButtonElement, DateRangePickerCloseProps>(
  function DateRangePickerClose({ className, ...props }, ref) {
    const { styles } = useDateRangePickerContext();
    return (
      <BasePopover.Close
        {...props}
        className={withRecipeClassName(styles.close, className)}
        data-slot="date-range-picker-close"
        ref={ref}
      />
    );
  },
);

export type DateRangePickerHeaderProps = ComponentPropsWithoutRef<"div">;
export const DateRangePickerHeader = forwardRef<HTMLDivElement, DateRangePickerHeaderProps>(
  function DateRangePickerHeader({ className, ...props }, ref) {
    const { styles } = useDateRangePickerContext();
    return (
      <div
        {...props}
        className={cx(styles.header, className)}
        data-slot="date-range-picker-header"
        ref={ref}
      />
    );
  },
);
export type DateRangePickerNavigationProps = ComponentPropsWithoutRef<"button"> & {
  amount?: number;
};
const DateRangePickerNavigationButton = forwardRef<
  HTMLButtonElement,
  DateRangePickerNavigationProps
>(function DateRangePickerNavigationButton(
  { amount = 1, children, className, onClick, ...props },
  ref,
) {
  const { canNavigate, month, setMonth, styles } = useDateRangePickerContext();
  const isDisabled = props.disabled || !canNavigate(amount);
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? (amount < 0 ? "Previous month" : "Next month")}
      className={cx(styles.navigation, className)}
      data-slot={amount < 0 ? "date-range-picker-previous" : "date-range-picker-next"}
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
});
export const DateRangePickerPrevious = forwardRef<
  HTMLButtonElement,
  DateRangePickerNavigationProps
>(function DateRangePickerPrevious(props, ref) {
  return <DateRangePickerNavigationButton {...props} amount={-1} ref={ref} />;
});
export const DateRangePickerNext = forwardRef<HTMLButtonElement, DateRangePickerNavigationProps>(
  function DateRangePickerNext(props, ref) {
    return <DateRangePickerNavigationButton {...props} amount={1} ref={ref} />;
  },
);
export type DateRangePickerMonthSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;
export const DateRangePickerMonthSelect = forwardRef<
  HTMLSelectElement,
  DateRangePickerMonthSelectProps
>(function DateRangePickerMonthSelect({ className, ...props }, ref) {
  const { locale, month, monthDisabled, selectMonth, styles } = useDateRangePickerContext();
  const labels = getMonthLabels(locale);
  return (
    <select
      {...props}
      aria-label={props["aria-label"] ?? "Select month"}
      className={cx(styles.monthSelect, className)}
      data-slot="date-range-picker-month-select"
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
});
export type DateRangePickerYearSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;
export const DateRangePickerYearSelect = forwardRef<
  HTMLSelectElement,
  DateRangePickerYearSelectProps
>(function DateRangePickerYearSelect({ className, ...props }, ref) {
  const { month, monthDisabled, selectYear, styles, yearRange } = useDateRangePickerContext();
  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, index) => yearRange.start + index,
  );
  return (
    <select
      {...props}
      aria-label={props["aria-label"] ?? "Select year"}
      className={cx(styles.yearSelect, className)}
      data-slot="date-range-picker-year-select"
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
});

export interface DateRangePickerDayProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  date: Date;
}
export const DateRangePickerDay = forwardRef<HTMLButtonElement, DateRangePickerDayProps>(
  function DateRangePickerDay(
    { children, className, date, disabled, onClick, onKeyDown, onMouseEnter, ...props },
    ref,
  ) {
    const {
      dateDisabled,
      disabled: pickerDisabled,
      focusDate,
      focusedDate,
      hoveredDate,
      locale,
      month,
      range,
      onSelect,
      registerDay,
      setHoveredDate,
      styles,
      today,
      weekStartsOn,
    } = useDateRangePickerContext();
    const key = dateKey(date);
    const isDisabled = Boolean(disabled || pickerDisabled || dateDisabled(date));
    const isStart = Boolean(range.start && isSameDay(date, range.start));
    const isEnd = Boolean(range.end && isSameDay(date, range.end));
    const inRange = dateInRange(date, range, hoveredDate);
    const outsideMonth = !sameMonth(date, month);
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
        aria-selected={isStart || isEnd}
        className={cx(styles.day, className)}
        data-date={key}
        data-disabled={isDisabled || undefined}
        data-in-range={inRange || undefined}
        data-outside-month={outsideMonth || undefined}
        data-range-end={isEnd || undefined}
        data-range-start={isStart || undefined}
        data-slot="date-range-picker-day"
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
        onMouseEnter={(event) => {
          if (!isDisabled) setHoveredDate(date);
          onMouseEnter?.(event);
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
  },
);

export interface DateRangePickerCalendarProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  "aria-label"?: string;
}
export const DateRangePickerCalendar = forwardRef<HTMLElement, DateRangePickerCalendarProps>(
  function DateRangePickerCalendar({ "aria-label": ariaLabel, className, ...props }, ref) {
    const { locale, month, styles, weekStartsOn } = useDateRangePickerContext();
    const days = useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
    const weekdays = useMemo(() => getWeekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
    return (
      <section
        {...props}
        aria-label={ariaLabel ?? formatMonthLabel(month, locale)}
        className={cx(styles.calendar, className)}
        data-slot="date-range-picker-calendar"
        ref={ref}
      >
        <div aria-hidden="true" className={styles.weekdays} data-slot="date-range-picker-weekdays">
          {weekdays.map((weekday) => (
            <span className={styles.weekday} data-slot="date-range-picker-weekday" key={weekday}>
              {weekday}
            </span>
          ))}
        </div>
        {/* biome-ignore lint/a11y/useSemanticElements: the calendar uses the ARIA grid pattern. */}
        <div
          aria-label={formatMonthLabel(month, locale)}
          className={styles.grid}
          data-slot="date-range-picker-grid"
          role="grid"
        >
          {days.map((date) => (
            <DateRangePickerDay date={date} key={dateKey(date)} />
          ))}
        </div>
      </section>
    );
  },
);

export interface DateRangePickerPreviewProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}
export const DateRangePickerPreview = forwardRef<HTMLDivElement, DateRangePickerPreviewProps>(
  function DateRangePickerPreview({ children, className, ...props }, ref) {
    const { hoveredDate, locale, range, styles } = useDateRangePickerContext();
    const content =
      children ??
      (range.start
        ? `${formatDateLabel(range.start, locale, "")} – ${range.end ? formatDateLabel(range.end, locale, "") : hoveredDate ? formatDateLabel(hoveredDate, locale, "") : "…"}`
        : "Select a start date");
    return (
      <div
        {...props}
        aria-live="polite"
        className={cx(styles.preview, className)}
        data-slot="date-range-picker-preview"
        ref={ref}
      >
        {content}
      </div>
    );
  },
);

export interface DateRangePickerInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "value" | "onChange"> {
  side: "start" | "end";
}
export const DateRangePickerInput = forwardRef<HTMLInputElement, DateRangePickerInputProps>(
  function DateRangePickerInput({ className, onBlur, onInput, side, ...props }, ref) {
    const { disabled, range, setRange, styles } = useDateRangePickerContext();
    const value = toInputDate(side === "start" ? range.start : range.end);
    return (
      <input
        {...props}
        aria-label={props["aria-label"] ?? (side === "start" ? "Start date" : "End date")}
        className={cx(styles.input, className)}
        data-slot={`date-range-picker-${side}-input`}
        disabled={disabled || props.disabled}
        onChange={(event) => {
          const [year, month, day] = event.currentTarget.value.split("-").map(Number);
          if (!year || !month || !day) return;
          const date = createCalendarDate(year, month - 1, day);
          setRange(
            side === "start" ? { start: date, end: range.end } : { start: range.start, end: date },
          );
        }}
        onBlur={onBlur}
        onInput={onInput}
        ref={ref}
        type="date"
        value={value}
      />
    );
  },
);

export const DateRangePickerStartInput = forwardRef<
  HTMLInputElement,
  Omit<DateRangePickerInputProps, "side">
>(function DateRangePickerStartInput(props, ref) {
  return <DateRangePickerInput {...props} ref={ref} side="start" />;
});
export const DateRangePickerEndInput = forwardRef<
  HTMLInputElement,
  Omit<DateRangePickerInputProps, "side">
>(function DateRangePickerEndInput(props, ref) {
  return <DateRangePickerInput {...props} ref={ref} side="end" />;
});

export const DateRangePicker = {
  Root: DateRangePickerRoot,
  Label: DateRangePickerLabel,
  Control: DateRangePickerControl,
  Trigger: DateRangePickerTrigger,
  Value: DateRangePickerValue,
  Clear: DateRangePickerClear,
  Portal: DateRangePickerPortal,
  Positioner: DateRangePickerPositioner,
  Popup: DateRangePickerPopup,
  Close: DateRangePickerClose,
  Header: DateRangePickerHeader,
  Previous: DateRangePickerPrevious,
  Next: DateRangePickerNext,
  MonthSelect: DateRangePickerMonthSelect,
  YearSelect: DateRangePickerYearSelect,
  Calendar: DateRangePickerCalendar,
  Day: DateRangePickerDay,
  Preview: DateRangePickerPreview,
  StartInput: DateRangePickerStartInput,
  EndInput: DateRangePickerEndInput,
};
