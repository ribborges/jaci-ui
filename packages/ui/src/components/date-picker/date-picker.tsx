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
import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode, Ref } from "react";
import type { PopoverRoot as BasePopoverRoot } from "@base-ui/react/popover";

import { cx } from "../../styled-system/css";
import { datePicker } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import {
  addDays,
  addMonths,
  createCalendarDate,
  dateKey,
  formatDateLabel,
  formatMonthLabel,
  getCalendarDays,
  getDateRangeLabel,
  getMonthLabels,
  getWeekdayLabels,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  startOfMonth,
  toInputDate,
  toInputDateTime,
  toInputMonth,
  toTimeInput,
} from "./date-utils";
import type { DatePickerGranularity } from "./date-utils";

export type DatePickerSize = "sm" | "md" | "lg";
export type { DatePickerGranularity } from "./date-utils";

export interface DatePickerYearRange {
  start: number;
  end: number;
}

interface DatePickerContextValue {
  canNavigate: (amount: number) => boolean;
  close: () => void;
  dateDisabled: (date: Date) => boolean;
  granularity: DatePickerGranularity;
  disabled: boolean;
  focusDate: (date: Date, direction?: number) => void;
  focusedDate: Date;
  formatDate: (date: Date | null) => string;
  labelId: string;
  locale: string;
  month: Date;
  monthDisabled: (date: Date) => boolean;
  onClear: () => void;
  onTimeChange: (value: string) => void;
  onSelect: (date: Date) => void;
  selectMonth: (month: number) => void;
  selectYear: (year: number) => void;
  placeholder: ReactNode;
  registerDay: (key: string, node: HTMLButtonElement | null) => void;
  selected: Date | null;
  setFocusedDate: (date: Date) => void;
  setMonth: (date: Date) => void;
  size: DatePickerSize;
  styles: ReturnType<typeof datePicker>;
  today: Date;
  timeMax: string | undefined;
  timeMin: string | undefined;
  triggerId: string;
  weekStartsOn: number;
  yearRange: DatePickerYearRange;
}

const DatePickerContext = createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error("DatePicker parts must be rendered inside DatePicker.Root.");
  }

  return context;
}

function isSameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

function composeRefs<T>(first: Ref<T> | undefined, second: (value: T | null) => void) {
  return (value: T | null) => {
    second(value);
    if (typeof first === "function") {
      first(value);
    } else if (first) {
      first.current = value;
    }
  };
}

export interface DatePickerRootProps extends Omit<BasePopoverRoot.Props, "children"> {
  /** Selected value. Use together with `onValueChange` for a controlled picker. */
  value?: Date | null;
  /** Initial selected value for an uncontrolled picker. */
  defaultValue?: Date | null;
  /** Called after a valid day, month, or time is selected, or when the value is cleared. */
  onValueChange?: (value: Date | null) => void;
  /** Prevents dates before this local calendar day from being selected. */
  minDate?: Date;
  /** Prevents dates after this local calendar day from being selected. */
  maxDate?: Date;
  /** Adds application-specific disabled dates, such as holidays or weekends. */
  isDateDisabled?: (date: Date) => boolean;
  /** Locale used for month, weekday and value formatting. */
  locale?: string;
  /** Called after the visible calendar month changes. */
  onMonthChange?: (month: Date) => void;
  /** First weekday in the calendar, where 0 is Sunday and 1 is Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Text shown when no date has been selected. */
  placeholder?: ReactNode;
  /** Shared visual size for the trigger and calendar days. */
  size?: DatePickerSize;
  /** Controls whether the picker selects days, months, or date and time. */
  granularity?: DatePickerGranularity;
  /** Inclusive range used by the year selector. */
  yearRange?: DatePickerYearRange;
  /** Adds a native hidden input using the representation for the selected granularity. */
  name?: string;
  /** Prevents interaction and disables the hidden form input. */
  disabled?: boolean;
  /** Closes the popup after a value is chosen. Defaults to false for date-time mode and true otherwise. */
  closeOnSelect?: boolean;
  children?: ReactNode;
}

export function DatePickerRoot({
  children,
  closeOnSelect: closeOnSelectProp,
  defaultValue = null,
  disabled = false,
  granularity = "day",
  isDateDisabled,
  locale = "pt-BR",
  maxDate,
  minDate,
  name,
  onValueChange,
  onMonthChange,
  placeholder = "Select a date",
  size = "md",
  value: controlledValue,
  weekStartsOn = 0,
  yearRange: configuredYearRange,
  actionsRef: externalActionsRef,
  ...popoverProps
}: DatePickerRootProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue);
  const selected = controlledValue === undefined ? uncontrolledValue : controlledValue;
  const [month, setMonthState] = useState(() => startOfMonth(selected ?? new Date()));
  const [focusedDate, setFocusedDate] = useState(selected ?? month);
  const previousMonthRef = useRef(month);
  const internalActionsRef = useRef<BasePopoverRoot.Actions | null>(null);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const labelId = useId();
  const triggerId = useId();
  const today = useMemo(() => new Date(), []);
  const styles = datePicker({ size });
  const minMonth = minDate ? startOfMonth(minDate) : undefined;
  const maxMonth = maxDate ? startOfMonth(maxDate) : undefined;
  const closeOnSelect = closeOnSelectProp ?? granularity !== "date-time";
  const yearRange = useMemo(() => {
    const defaultStart = today.getFullYear() - 100;
    const defaultEnd = today.getFullYear() + 20;
    const start = configuredYearRange?.start ?? defaultStart;
    const end = configuredYearRange?.end ?? defaultEnd;
    const years = [selected?.getFullYear(), minDate?.getFullYear(), maxDate?.getFullYear()].filter(
      (year): year is number => year !== undefined,
    );
    return {
      end: Math.max(start, end, ...years),
      start: Math.min(start, end, ...years),
    };
  }, [configuredYearRange?.end, configuredYearRange?.start, maxDate, minDate, selected, today]);

  const clampMonth = useCallback(
    (nextMonth: Date) => {
      const normalized = startOfMonth(nextMonth);
      if (minMonth && isBeforeDay(normalized, minMonth)) return minMonth;
      if (maxMonth && isAfterDay(normalized, maxMonth)) return maxMonth;
      return normalized;
    },
    [maxMonth, minMonth],
  );

  const setMonth = useCallback(
    (nextMonth: Date) => {
      const normalized = clampMonth(nextMonth);
      setMonthState((current) => {
        if (isSameMonth(current, normalized)) return current;
        return normalized;
      });
    },
    [clampMonth],
  );

  useEffect(() => {
    if (isSameMonth(previousMonthRef.current, month)) return;
    previousMonthRef.current = month;
    onMonthChange?.(month);
  }, [month, onMonthChange]);

  useEffect(() => {
    if (!selected) {
      return;
    }

    setFocusedDate(selected);
    setMonthState((current) => (isSameMonth(current, selected) ? current : clampMonth(selected)));
  }, [clampMonth, selected]);

  const dateDisabled = useCallback(
    (date: Date) =>
      Boolean(
        (minDate && isBeforeDay(date, minDate)) ||
          (maxDate && isAfterDay(date, maxDate)) ||
          isDateDisabled?.(date),
      ),
    [isDateDisabled, maxDate, minDate],
  );

  const close = useCallback(() => {
    (externalActionsRef ?? internalActionsRef).current?.close();
  }, [externalActionsRef]);

  const setValue = useCallback(
    (nextValue: Date | null) => {
      setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [onValueChange],
  );

  const monthDisabled = useCallback(
    (candidate: Date) => {
      const firstDay = startOfMonth(candidate);
      const lastDay = createCalendarDate(candidate.getFullYear(), candidate.getMonth() + 1, 0);
      return Boolean(
        (minDate && isBeforeDay(lastDay, minDate)) || (maxDate && isAfterDay(firstDay, maxDate)),
      );
    },
    [maxDate, minDate],
  );

  const onSelect = useCallback(
    (date: Date) => {
      if (disabled || (granularity === "month" ? monthDisabled(date) : dateDisabled(date))) {
        return;
      }

      const nextValue = createCalendarDate(
        date.getFullYear(),
        date.getMonth(),
        granularity === "month" ? 1 : date.getDate(),
      );
      if (granularity === "date-time") {
        nextValue.setHours(selected?.getHours() ?? 12, selected?.getMinutes() ?? 0, 0, 0);
        if (minDate && isSameDay(nextValue, minDate) && nextValue < minDate) {
          nextValue.setHours(minDate.getHours(), minDate.getMinutes(), 0, 0);
        }
        if (maxDate && isSameDay(nextValue, maxDate) && nextValue > maxDate) {
          nextValue.setHours(maxDate.getHours(), maxDate.getMinutes(), 0, 0);
        }
      }
      setValue(nextValue);
      setFocusedDate(nextValue);
      setMonth(startOfMonth(nextValue));
      if (closeOnSelect) {
        close();
      }
    },
    [
      close,
      closeOnSelect,
      dateDisabled,
      disabled,
      granularity,
      maxDate,
      monthDisabled,
      minDate,
      selected,
      setMonth,
      setValue,
    ],
  );

  const onClear = useCallback(() => {
    setValue(null);
  }, [setValue]);

  const selectMonth = useCallback(
    (monthIndex: number) => {
      const nextMonth = clampMonth(createCalendarDate(month.getFullYear(), monthIndex, 1));
      if (monthDisabled(nextMonth)) return;
      setMonth(nextMonth);
      if (granularity === "month") {
        const nextValue = createCalendarDate(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        setFocusedDate(nextValue);
        setValue(nextValue);
        if (closeOnSelect) close();
      }
    },
    [clampMonth, close, closeOnSelect, granularity, month, monthDisabled, setMonth, setValue],
  );

  const selectYear = useCallback(
    (year: number) => {
      const nextMonth = clampMonth(createCalendarDate(year, month.getMonth(), 1));
      if (monthDisabled(nextMonth)) return;
      setMonth(nextMonth);
      if (granularity === "month") {
        const nextValue = createCalendarDate(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        setFocusedDate(nextValue);
        setValue(nextValue);
        if (closeOnSelect) close();
      }
    },
    [clampMonth, close, closeOnSelect, granularity, month, monthDisabled, setMonth, setValue],
  );

  const onTimeChange = useCallback(
    (value: string) => {
      const match = value.match(/^(\d{2}):(\d{2})$/);
      if (!match) return;
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (hours > 23 || minutes > 59) return;
      const baseDate = selected ?? focusedDate;
      const nextValue = createCalendarDate(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
      );
      nextValue.setHours(hours, minutes, 0, 0);
      if (minDate && isSameDay(nextValue, minDate) && nextValue < minDate) return;
      if (maxDate && isSameDay(nextValue, maxDate) && nextValue > maxDate) return;
      setValue(nextValue);
    },
    [focusedDate, maxDate, minDate, selected, setValue],
  );

  const focusDate = useCallback(
    (date: Date, direction = 1) => {
      let nextDate = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
      const step = direction < 0 ? -1 : 1;
      let attempts = 0;
      while (dateDisabled(nextDate) && attempts < 366) {
        nextDate = addDays(nextDate, step);
        attempts += 1;
      }

      setFocusedDate(nextDate);
      setMonth(nextDate);

      const focusTarget = () => dayRefs.current.get(dateKey(nextDate))?.focus();
      focusTarget();
      queueMicrotask(focusTarget);
    },
    [dateDisabled, setMonth],
  );

  const canNavigate = useCallback(
    (amount: number) => {
      const nextMonth = addMonths(month, amount);
      return !(
        (minMonth && isBeforeDay(nextMonth, minMonth)) ||
        (maxMonth && isAfterDay(nextMonth, maxMonth))
      );
    },
    [maxMonth, minMonth, month],
  );

  const registerDay = useCallback((key: string, node: HTMLButtonElement | null) => {
    if (node) {
      dayRefs.current.set(key, node);
    } else {
      dayRefs.current.delete(key);
    }
  }, []);

  const timeMin =
    selected && minDate && isSameDay(selected, minDate) ? toTimeInput(minDate) : undefined;
  const timeMax =
    selected && maxDate && isSameDay(selected, maxDate) ? toTimeInput(maxDate) : undefined;

  const context: DatePickerContextValue = {
    canNavigate,
    close,
    dateDisabled,
    granularity,
    disabled,
    focusDate,
    focusedDate,
    formatDate: (date) => formatDateLabel(date, locale, String(placeholder), granularity),
    labelId,
    locale,
    month,
    monthDisabled,
    onClear,
    onTimeChange,
    onSelect,
    selectMonth,
    selectYear,
    placeholder,
    registerDay,
    selected,
    setFocusedDate,
    setMonth,
    size,
    styles,
    today: createCalendarDate(today.getFullYear(), today.getMonth(), today.getDate()),
    timeMax,
    timeMin,
    triggerId,
    weekStartsOn,
    yearRange,
  };

  return (
    <DatePickerContext.Provider value={context}>
      <BasePopover.Root {...popoverProps} actionsRef={externalActionsRef ?? internalActionsRef}>
        {children}
      </BasePopover.Root>
      {name ? (
        <input
          disabled={disabled}
          name={name}
          type="hidden"
          value={
            granularity === "month"
              ? toInputMonth(selected)
              : granularity === "date-time"
                ? toInputDateTime(selected)
                : toInputDate(selected)
          }
        />
      ) : null}
    </DatePickerContext.Provider>
  );
}

export type DatePickerLabelProps = ComponentPropsWithoutRef<"label">;

export const DatePickerLabel = forwardRef<HTMLLabelElement, DatePickerLabelProps>(
  function DatePickerLabel({ children, className, ...props }, ref) {
    const { labelId, styles, triggerId } = useDatePickerContext();

    return (
      <label
        {...props}
        ref={ref}
        className={cx(styles.label, className)}
        data-slot="date-picker-label"
        htmlFor={props.htmlFor ?? triggerId}
        id={props.id ?? labelId}
      >
        {children}
      </label>
    );
  },
);

export type DatePickerControlProps = ComponentPropsWithoutRef<"div">;

export const DatePickerControl = forwardRef<HTMLDivElement, DatePickerControlProps>(
  function DatePickerControl({ className, ...props }, ref) {
    const { styles } = useDatePickerContext();

    return (
      <div
        {...props}
        ref={ref}
        className={cx(styles.control, className)}
        data-jaci-component="date-picker"
        data-slot="date-picker-control"
      />
    );
  },
);

export type DatePickerTriggerProps = ComponentPropsWithoutRef<typeof BasePopover.Trigger>;

export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  function DatePickerTrigger({ children, className, disabled, id, ...props }, ref) {
    const { disabled: pickerDisabled, styles, triggerId } = useDatePickerContext();

    return (
      <BasePopover.Trigger
        {...props}
        aria-label={props["aria-label"] ?? "Choose date"}
        disabled={disabled ?? pickerDisabled}
        id={id ?? triggerId}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-jaci-component="date-picker"
        data-slot="date-picker-trigger"
      >
        {children ?? (
          <>
            <DatePickerValue />
            <span aria-hidden="true">▾</span>
          </>
        )}
      </BasePopover.Trigger>
    );
  },
);

export interface DatePickerValueProps extends ComponentPropsWithoutRef<"span"> {
  placeholder?: ReactNode;
}

export const DatePickerValue = forwardRef<HTMLSpanElement, DatePickerValueProps>(
  function DatePickerValue({ children, className, placeholder, ...props }, ref) {
    const { formatDate, selected, styles } = useDatePickerContext();
    const value = children ?? (selected ? formatDate(selected) : (placeholder ?? "Select a date"));

    return (
      <span
        {...props}
        ref={ref}
        className={cx(styles.value, className)}
        data-placeholder={selected ? undefined : "true"}
        data-slot="date-picker-value"
      >
        {value}
      </span>
    );
  },
);

export type DatePickerClearProps = ComponentPropsWithoutRef<"button">;

export const DatePickerClear = forwardRef<HTMLButtonElement, DatePickerClearProps>(
  function DatePickerClear({ children = "×", className, disabled, onClick, ...props }, ref) {
    const { close, disabled: pickerDisabled, onClear, selected, styles } = useDatePickerContext();
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClear();
      onClick?.(event);
      close();
    };

    return (
      <button
        {...props}
        aria-label={props["aria-label"] ?? "Clear date"}
        className={cx(styles.clear, className)}
        data-slot="date-picker-clear"
        disabled={disabled || pickerDisabled || !selected}
        onClick={handleClick}
        ref={ref}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export type DatePickerPortalProps = ComponentPropsWithoutRef<typeof BasePopover.Portal>;
export const DatePickerPortal: typeof BasePopover.Portal = BasePopover.Portal;

export type DatePickerPositionerProps = ComponentPropsWithoutRef<typeof BasePopover.Positioner>;

export const DatePickerPositioner = forwardRef<HTMLDivElement, DatePickerPositionerProps>(
  function DatePickerPositioner({ className, ...props }, ref) {
    const { styles } = useDatePickerContext();

    return (
      <BasePopover.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.positioner, className)}
        data-slot="date-picker-positioner"
      />
    );
  },
);

export type DatePickerPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;

export const DatePickerPopup = forwardRef<HTMLDivElement, DatePickerPopupProps>(
  function DatePickerPopup({ className, ...props }, ref) {
    const { styles } = useDatePickerContext();

    return (
      <BasePopover.Popup
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Calendar"}
        className={withRecipeClassName(styles.popup, className)}
        data-slot="date-picker-popup"
      />
    );
  },
);

export type DatePickerCloseProps = ComponentPropsWithoutRef<typeof BasePopover.Close>;

export const DatePickerClose = forwardRef<HTMLButtonElement, DatePickerCloseProps>(
  function DatePickerClose({ className, ...props }, ref) {
    const { styles } = useDatePickerContext();

    return (
      <BasePopover.Close
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.clear, className)}
        data-slot="date-picker-close"
      />
    );
  },
);

export type DatePickerHeaderProps = ComponentPropsWithoutRef<"div">;

export const DatePickerHeader = forwardRef<HTMLDivElement, DatePickerHeaderProps>(
  function DatePickerHeader({ className, ...props }, ref) {
    const { styles } = useDatePickerContext();

    return (
      <div
        {...props}
        ref={ref}
        className={cx(styles.header, className)}
        data-slot="date-picker-header"
      />
    );
  },
);

export type DatePickerCaptionProps = ComponentPropsWithoutRef<"span">;

export const DatePickerCaption = forwardRef<HTMLSpanElement, DatePickerCaptionProps>(
  function DatePickerCaption({ children, className, ...props }, ref) {
    const { locale, month, styles } = useDatePickerContext();

    return (
      <span
        {...props}
        ref={ref}
        className={cx(styles.caption, className)}
        data-slot="date-picker-caption"
      >
        {children ?? formatMonthLabel(month, locale)}
      </span>
    );
  },
);

export type DatePickerMonthSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;

export const DatePickerMonthSelect = forwardRef<HTMLSelectElement, DatePickerMonthSelectProps>(
  function DatePickerMonthSelect({ className, ...props }, ref) {
    const { locale, month, monthDisabled, selectMonth, styles } = useDatePickerContext();
    const labels = getMonthLabels(locale);

    return (
      <select
        {...props}
        aria-label={props["aria-label"] ?? "Select month"}
        className={cx(styles.monthSelect, className)}
        data-slot="date-picker-month-select"
        onChange={(event) => selectMonth(Number(event.currentTarget.value))}
        ref={ref}
        value={month.getMonth()}
      >
        {labels.map((label, monthIndex) => (
          <option
            disabled={monthDisabled(createCalendarDate(month.getFullYear(), monthIndex, 1))}
            key={label}
            value={monthIndex}
          >
            {label}
          </option>
        ))}
      </select>
    );
  },
);

export type DatePickerYearSelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "onChange" | "value"
>;

export const DatePickerYearSelect = forwardRef<HTMLSelectElement, DatePickerYearSelectProps>(
  function DatePickerYearSelect({ className, ...props }, ref) {
    const { month, monthDisabled, selectYear, styles, yearRange } = useDatePickerContext();
    const years = Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, index) => yearRange.start + index,
    );

    return (
      <select
        {...props}
        aria-label={props["aria-label"] ?? "Select year"}
        className={cx(styles.yearSelect, className)}
        data-slot="date-picker-year-select"
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

export type DatePickerTimeFieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange" | "type" | "value"
>;

export const DatePickerTimeField = forwardRef<HTMLInputElement, DatePickerTimeFieldProps>(
  function DatePickerTimeField({ className, ...props }, ref) {
    const { disabled, granularity, onTimeChange, selected, styles, timeMax, timeMin } =
      useDatePickerContext();
    if (granularity !== "date-time") return null;

    return (
      <input
        {...props}
        aria-label={props["aria-label"] ?? "Select time"}
        className={cx(styles.timeField, className)}
        data-slot="date-picker-time-field"
        disabled={disabled || !selected}
        max={timeMax}
        min={timeMin}
        onChange={(event) => onTimeChange(event.currentTarget.value)}
        ref={ref}
        type="time"
        value={toTimeInput(selected)}
      />
    );
  },
);

export interface DatePickerNavigationProps extends ComponentPropsWithoutRef<"button"> {
  amount?: number;
}

const DatePickerNavigationButton = forwardRef<HTMLButtonElement, DatePickerNavigationProps>(
  function DatePickerNavigationButton({ amount, children, className, onClick, ...props }, ref) {
    const { canNavigate, month, setMonth, styles } = useDatePickerContext();
    const direction = amount ?? 1;
    const isDisabled = props.disabled || !canNavigate(direction);

    return (
      <button
        {...props}
        aria-label={props["aria-label"] ?? (direction < 0 ? "Previous month" : "Next month")}
        className={cx(styles.navigation, className)}
        data-slot={direction < 0 ? "date-picker-previous" : "date-picker-next"}
        disabled={isDisabled}
        onClick={(event) => {
          if (!isDisabled) setMonth(addMonths(month, direction));
          onClick?.(event);
        }}
        ref={ref}
        type="button"
      >
        {children ?? (direction < 0 ? "‹" : "›")}
      </button>
    );
  },
);

export const DatePickerPrevious = forwardRef<HTMLButtonElement, DatePickerNavigationProps>(
  function DatePickerPrevious(props, ref) {
    return <DatePickerNavigationButton {...props} amount={-1} ref={ref} />;
  },
);

export const DatePickerNext = forwardRef<HTMLButtonElement, DatePickerNavigationProps>(
  function DatePickerNext(props, ref) {
    return <DatePickerNavigationButton {...props} amount={1} ref={ref} />;
  },
);

export interface DatePickerDayProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  date: Date;
}

export const DatePickerDay = forwardRef<HTMLButtonElement, DatePickerDayProps>(
  function DatePickerDay(
    { children, className, date, disabled, onClick, onKeyDown, ...props },
    ref,
  ) {
    const {
      dateDisabled,
      disabled: pickerDisabled,
      focusDate,
      focusedDate,
      locale,
      month,
      onSelect,
      registerDay,
      selected,
      styles,
      today,
    } = useDatePickerContext();
    const key = dateKey(date);
    const outsideMonth = !isSameMonth(date, month);
    const isDisabled = disabled || pickerDisabled || dateDisabled(date);
    const isFocused = isSameDay(date, focusedDate);
    const isSelected = isSameDay(date, selected);
    const isToday = isSameDay(date, today);
    const dayRef = composeRefs(ref, (node) => registerDay(key, node));

    const moveByKey = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented) {
        return;
      }

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
          nextDate = addDays(date, -date.getDay());
          break;
        case "End":
          nextDate = addDays(date, 6 - date.getDay());
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
        default:
          break;
      }

      if (nextDate) {
        event.preventDefault();
        focusDate(nextDate, nextDate < date ? -1 : 1);
      }
    };

    return (
      // biome-ignore lint/a11y/useSemanticElements: A calendar day is an interactive gridcell, not a generic table cell.
      <button
        {...props}
        ref={dayRef}
        aria-label={props["aria-label"] ?? getDateRangeLabel(date, locale)}
        aria-current={isToday ? "date" : undefined}
        aria-selected={isSelected}
        className={cx(styles.day, className)}
        data-date={key}
        data-disabled={isDisabled || undefined}
        data-outside-month={outsideMonth || undefined}
        data-selected={isSelected || undefined}
        data-slot="date-picker-day"
        data-today={isToday || undefined}
        disabled={isDisabled}
        onClick={(event) => {
          onSelect(date);
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          moveByKey(event);
          onKeyDown?.(event);
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

interface DatePickerMonthButtonProps {
  date: Date;
}

const DatePickerMonthButton = forwardRef<HTMLButtonElement, DatePickerMonthButtonProps>(
  function DatePickerMonthButton({ date }, ref) {
    const { disabled, granularity, locale, monthDisabled, onSelect, selected, styles } =
      useDatePickerContext();
    const isDisabled = disabled || monthDisabled(date);
    const isSelected = granularity === "month" && Boolean(selected && isSameMonth(selected, date));

    return (
      // biome-ignore lint/a11y/useSemanticElements: Month choices use the calendar gridcell pattern.
      <button
        aria-label={new Intl.DateTimeFormat(locale, { month: "long" }).format(date)}
        aria-selected={isSelected}
        className={styles.month}
        data-disabled={isDisabled || undefined}
        data-selected={isSelected || undefined}
        data-slot="date-picker-month"
        disabled={isDisabled}
        onClick={() => onSelect(date)}
        ref={ref}
        role="gridcell"
        type="button"
      >
        {new Intl.DateTimeFormat(locale, { month: "short" }).format(date)}
      </button>
    );
  },
);

export interface DatePickerCalendarProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  "aria-label"?: string;
}

export const DatePickerCalendar = forwardRef<HTMLElement, DatePickerCalendarProps>(
  function DatePickerCalendar({ "aria-label": ariaLabel, className, ...props }, ref) {
    const { granularity, locale, month, styles, weekStartsOn } = useDatePickerContext();
    const days = useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
    const weekdays = useMemo(() => getWeekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);
    const monthDates = useMemo(
      () =>
        Array.from({ length: 12 }, (_, index) => createCalendarDate(month.getFullYear(), index, 1)),
      [month],
    );

    return (
      <section
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? formatMonthLabel(month, locale)}
        className={cx(styles.calendar, className)}
        data-granularity={granularity}
        data-slot="date-picker-calendar"
      >
        {granularity === "month" ? (
          // biome-ignore lint/a11y/useSemanticElements: Month selection uses the calendar grid pattern.
          <div
            aria-label={String(month.getFullYear())}
            className={styles.monthGrid}
            data-slot="date-picker-month-grid"
            role="grid"
          >
            {monthDates.map((date) => (
              <DatePickerMonthButton date={date} key={dateKey(date)} />
            ))}
          </div>
        ) : (
          <>
            <div aria-hidden="true" className={styles.weekdays} data-slot="date-picker-weekdays">
              {weekdays.map((weekday) => (
                <span className={styles.weekday} data-slot="date-picker-weekday" key={weekday}>
                  {weekday}
                </span>
              ))}
            </div>
            {/* biome-ignore lint/a11y/useSemanticElements: Calendar grids use the WAI-ARIA grid pattern for roving day focus. */}
            <div
              aria-label={formatMonthLabel(month, locale)}
              className={styles.grid}
              data-slot="date-picker-grid"
              role="grid"
            >
              {days.map((date) => (
                <DatePickerDay date={date} key={dateKey(date)} />
              ))}
            </div>
          </>
        )}
      </section>
    );
  },
);

export const DatePicker = {
  Root: DatePickerRoot,
  Label: DatePickerLabel,
  Control: DatePickerControl,
  Trigger: DatePickerTrigger,
  Value: DatePickerValue,
  Clear: DatePickerClear,
  Portal: DatePickerPortal,
  Positioner: DatePickerPositioner,
  Popup: DatePickerPopup,
  Close: DatePickerClose,
  Header: DatePickerHeader,
  Caption: DatePickerCaption,
  MonthSelect: DatePickerMonthSelect,
  YearSelect: DatePickerYearSelect,
  TimeField: DatePickerTimeField,
  Previous: DatePickerPrevious,
  Next: DatePickerNext,
  Day: DatePickerDay,
  Calendar: DatePickerCalendar,
};
