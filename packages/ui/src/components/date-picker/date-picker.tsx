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
  getWeekdayLabels,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  startOfMonth,
  toInputDate,
} from "./date-utils";

export type DatePickerSize = "sm" | "md" | "lg";

interface DatePickerContextValue {
  canNavigate: (amount: number) => boolean;
  close: () => void;
  dateDisabled: (date: Date) => boolean;
  disabled: boolean;
  focusDate: (date: Date, direction?: number) => void;
  focusedDate: Date;
  formatDate: (date: Date | null) => string;
  labelId: string;
  locale: string;
  month: Date;
  onClear: () => void;
  onSelect: (date: Date) => void;
  placeholder: ReactNode;
  registerDay: (key: string, node: HTMLButtonElement | null) => void;
  selected: Date | null;
  setFocusedDate: (date: Date) => void;
  setMonth: (date: Date) => void;
  size: DatePickerSize;
  styles: ReturnType<typeof datePicker>;
  today: Date;
  triggerId: string;
  weekStartsOn: number;
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
  /** Called after a valid day is selected, or when the value is cleared. */
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
  /** Adds a native hidden input using the `YYYY-MM-DD` representation. */
  name?: string;
  /** Prevents interaction and disables the hidden form input. */
  disabled?: boolean;
  /** Closes the popup after a day is chosen. Defaults to true. */
  closeOnSelect?: boolean;
  children?: ReactNode;
}

export function DatePickerRoot({
  children,
  closeOnSelect = true,
  defaultValue = null,
  disabled = false,
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

  const onSelect = useCallback(
    (date: Date) => {
      if (disabled || dateDisabled(date)) {
        return;
      }

      const nextValue = createCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
      setUncontrolledValue(nextValue);
      setFocusedDate(nextValue);
      setMonth(startOfMonth(nextValue));
      onValueChange?.(nextValue);
      if (closeOnSelect) {
        close();
      }
    },
    [close, closeOnSelect, dateDisabled, disabled, onValueChange, setMonth],
  );

  const onClear = useCallback(() => {
    setUncontrolledValue(null);
    onValueChange?.(null);
  }, [onValueChange]);

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

  const context: DatePickerContextValue = {
    canNavigate,
    close,
    dateDisabled,
    disabled,
    focusDate,
    focusedDate,
    formatDate: (date) => formatDateLabel(date, locale, String(placeholder)),
    labelId,
    locale,
    month,
    onClear,
    onSelect,
    placeholder,
    registerDay,
    selected,
    setFocusedDate,
    setMonth,
    size,
    styles,
    today: createCalendarDate(today.getFullYear(), today.getMonth(), today.getDate()),
    triggerId,
    weekStartsOn,
  };

  return (
    <DatePickerContext.Provider value={context}>
      <BasePopover.Root {...popoverProps} actionsRef={externalActionsRef ?? internalActionsRef}>
        {children}
      </BasePopover.Root>
      {name ? (
        <input disabled={disabled} name={name} type="hidden" value={toInputDate(selected)} />
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

export interface DatePickerCalendarProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  "aria-label"?: string;
}

export const DatePickerCalendar = forwardRef<HTMLElement, DatePickerCalendarProps>(
  function DatePickerCalendar({ "aria-label": ariaLabel, className, ...props }, ref) {
    const { locale, month, styles, weekStartsOn } = useDatePickerContext();
    const days = useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
    const weekdays = useMemo(() => getWeekdayLabels(locale, weekStartsOn), [locale, weekStartsOn]);

    return (
      <section
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? formatMonthLabel(month, locale)}
        className={cx(styles.calendar, className)}
        data-slot="date-picker-calendar"
      >
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
  Previous: DatePickerPrevious,
  Next: DatePickerNext,
  Day: DatePickerDay,
  Calendar: DatePickerCalendar,
};
