"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { stepper } from "../../styled-system/recipes";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperStatus = "current" | "complete" | "upcoming" | "disabled";

interface StepRecord {
  value: string;
  disabled: boolean;
  status?: StepperStatus;
}

interface StepperContextValue {
  activeValue: string | undefined;
  allowStepSelect: boolean;
  disabled: boolean;
  getStatus: (value: string, status?: StepperStatus, disabled?: boolean) => StepperStatus;
  goTo: (value: string, options?: { fromNavigation?: boolean }) => void;
  linear: boolean;
  orientation: StepperOrientation;
  register: (record: StepRecord) => void;
  unregister: (value: string) => void;
  move: (direction: -1 | 1) => void;
  moveToBoundary: (direction: -1 | 1) => void;
}

interface StepperItemContextValue {
  disabled: boolean;
  status: StepperStatus;
  value: string;
}

const StepperContext = createContext<StepperContextValue | null>(null);
const StepperItemContext = createContext<StepperItemContextValue | null>(null);

function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) throw new Error("Stepper parts must be rendered inside Stepper.Root.");
  return context;
}

function useStepperItemContext() {
  const context = useContext(StepperItemContext);
  if (!context) throw new Error("This Stepper part must be rendered inside Stepper.Item.");
  return context;
}

export interface StepperRootProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
  linear?: boolean;
  allowStepSelect?: boolean;
  disabled?: boolean;
  name?: string;
  form?: string;
  children?: ReactNode;
}

export const StepperRoot = forwardRef<HTMLElement, StepperRootProps>(function StepperRoot(
  {
    allowStepSelect = true,
    "aria-label": ariaLabel,
    children,
    className,
    defaultValue,
    disabled = false,
    form,
    linear = false,
    name,
    onValueChange,
    orientation = "horizontal",
    value: controlledValue,
    ...props
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [records, setRecords] = useState<StepRecord[]>([]);
  const activeValue = controlledValue ?? uncontrolledValue ?? records[0]?.value;

  const register = useCallback((record: StepRecord) => {
    setRecords((current) => {
      const index = current.findIndex((item) => item.value === record.value);
      if (index === -1) return [...current, record];
      const currentRecord = current[index];
      if (!currentRecord) return current;
      if (currentRecord.disabled === record.disabled && currentRecord.status === record.status) {
        return current;
      }
      const next = current.slice();
      next[index] = record;
      return next;
    });
  }, []);

  const unregister = useCallback((valueToRemove: string) => {
    setRecords((current) => current.filter((item) => item.value !== valueToRemove));
  }, []);

  const goTo = useCallback(
    (nextValue: string, options?: { fromNavigation?: boolean }) => {
      if (disabled) return;
      const targetIndex = records.findIndex((item) => item.value === nextValue);
      const activeIndex = records.findIndex((item) => item.value === activeValue);
      const target = records[targetIndex];
      if (!target || target.disabled) return;
      if (nextValue === activeValue) return;
      if (!allowStepSelect && !options?.fromNavigation && nextValue !== activeValue) return;
      if (linear && activeIndex >= 0 && targetIndex > activeIndex + 1) return;
      if (controlledValue === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [activeValue, allowStepSelect, controlledValue, disabled, linear, onValueChange, records],
  );

  const move = useCallback(
    (direction: -1 | 1) => {
      const activeIndex = records.findIndex((item) => item.value === activeValue);
      let index = activeIndex + direction;
      while (index >= 0 && index < records.length && records[index]?.disabled) index += direction;
      const target = records[index];
      if (target) goTo(target.value, { fromNavigation: true });
    },
    [activeValue, goTo, records],
  );

  const moveToBoundary = useCallback(
    (direction: -1 | 1) => {
      const candidates = direction === -1 ? records : records.slice().reverse();
      const target = candidates.find((record) => !record.disabled);
      if (target) goTo(target.value, { fromNavigation: true });
    },
    [goTo, records],
  );

  const getStatus = useCallback(
    (itemValue: string, explicitStatus?: StepperStatus, itemDisabled = false) => {
      if (itemDisabled || disabled) return "disabled";
      if (explicitStatus) return explicitStatus;
      const itemIndex = records.findIndex((item) => item.value === itemValue);
      const activeIndex = records.findIndex((item) => item.value === activeValue);
      if (itemValue === activeValue || (activeIndex < 0 && itemIndex === 0)) return "current";
      if (itemIndex >= 0 && activeIndex >= 0 && itemIndex < activeIndex) return "complete";
      return "upcoming";
    },
    [activeValue, disabled, records],
  );

  const context = useMemo(
    () => ({
      activeValue,
      allowStepSelect,
      disabled,
      getStatus,
      goTo,
      linear,
      move,
      moveToBoundary,
      orientation,
      register,
      unregister,
    }),
    [
      activeValue,
      allowStepSelect,
      disabled,
      getStatus,
      goTo,
      linear,
      move,
      moveToBoundary,
      orientation,
      register,
      unregister,
    ],
  );

  return (
    <StepperContext.Provider value={context}>
      <nav
        {...props}
        aria-label={ariaLabel ?? "Progress"}
        className={cx(stepper({ orientation }).root, className)}
        data-jaci-component="stepper"
        data-orientation={orientation}
        data-slot="stepper"
        data-state={disabled ? "disabled" : "active"}
        ref={ref}
      >
        {children}
        {name ? (
          <input
            aria-hidden="true"
            name={name}
            type="hidden"
            value={activeValue ?? ""}
            form={form}
          />
        ) : null}
      </nav>
    </StepperContext.Provider>
  );
});

export type StepperListProps = ComponentPropsWithoutRef<"ol">;
export const StepperList = forwardRef<HTMLOListElement, StepperListProps>(function StepperList(
  { className, ...props },
  ref,
) {
  const { orientation } = useStepperContext();
  return (
    <ol
      {...props}
      className={cx(stepper({ orientation }).list, className)}
      data-slot="stepper-list"
      ref={ref}
    />
  );
});

export interface StepperItemProps extends ComponentPropsWithoutRef<"li"> {
  value: string;
  status?: StepperStatus;
  disabled?: boolean;
}

export const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(function StepperItem(
  { children, className, disabled = false, status, value, ...props },
  ref,
) {
  const context = useStepperContext();
  const resolvedStatus = context.getStatus(value, status, disabled);
  useEffect(() => {
    const record: StepRecord = { disabled: disabled || status === "disabled", value };
    if (status !== undefined) record.status = status;
    context.register(record);
    return () => context.unregister(value);
  }, [context.register, context.unregister, disabled, status, value]);
  const itemContext = useMemo<StepperItemContextValue>(
    () => ({
      disabled: disabled || context.disabled || resolvedStatus === "disabled",
      status: resolvedStatus,
      value,
    }),
    [context.disabled, disabled, resolvedStatus, value],
  );
  const styles = stepper({ orientation: context.orientation, status: resolvedStatus });

  return (
    <StepperItemContext.Provider value={itemContext}>
      <li
        {...props}
        aria-disabled={itemContext.disabled || undefined}
        className={cx(styles.item, className)}
        data-disabled={itemContext.disabled || undefined}
        data-jaci-component="stepper-item"
        data-slot="stepper-item"
        data-status={resolvedStatus}
        data-value={value}
        ref={ref}
      >
        {children}
      </li>
    </StepperItemContext.Provider>
  );
});

export type StepperTriggerProps = ComponentPropsWithoutRef<"button">;
export const StepperTrigger = forwardRef<HTMLButtonElement, StepperTriggerProps>(
  function StepperTrigger({ className, onClick, onKeyDown, type = "button", ...props }, ref) {
    const context = useStepperContext();
    const item = useStepperItemContext();
    const styles = stepper({ orientation: context.orientation, status: item.status });
    return (
      <button
        {...props}
        aria-current={item.status === "current" ? "step" : undefined}
        aria-disabled={
          item.disabled || (!context.allowStepSelect && item.status !== "current") || undefined
        }
        className={cx(styles.trigger, className)}
        data-disabled={item.disabled || undefined}
        data-slot="stepper-trigger"
        data-status={item.status}
        disabled={context.disabled || item.disabled}
        onClick={(event) => {
          if (!event.defaultPrevented) context.goTo(item.value);
          onClick?.(event);
        }}
        onKeyDown={(event) => {
          const isForwardKey =
            (context.orientation === "horizontal" && event.key === "ArrowRight") ||
            (context.orientation === "vertical" && event.key === "ArrowDown");
          const isBackwardKey =
            (context.orientation === "horizontal" && event.key === "ArrowLeft") ||
            (context.orientation === "vertical" && event.key === "ArrowUp");
          if (isForwardKey) {
            event.preventDefault();
            context.move(1);
          } else if (isBackwardKey) {
            event.preventDefault();
            context.move(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            context.moveToBoundary(-1);
          } else if (event.key === "End") {
            event.preventDefault();
            context.moveToBoundary(1);
          }
          onKeyDown?.(event);
        }}
        ref={ref}
        type={type}
      />
    );
  },
);

export type StepperIndicatorProps = ComponentPropsWithoutRef<"span">;
export const StepperIndicator = forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  function StepperIndicator({ children, className, ...props }, ref) {
    const { orientation } = useStepperContext();
    const item = useStepperItemContext();
    const styles = stepper({ orientation, status: item.status });
    return (
      <span
        {...props}
        aria-hidden={props["aria-hidden"] ?? true}
        className={cx(styles.indicator, className)}
        data-slot="stepper-indicator"
        data-status={item.status}
        ref={ref}
      >
        {children ?? (item.status === "complete" ? "✓" : "")}
      </span>
    );
  },
);

function createSpanSlot(slot: "title" | "description" | "separator") {
  return forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(function StepperSlot(
    { className, ...props },
    ref,
  ) {
    const { orientation } = useStepperContext();
    const item = useStepperItemContext();
    const styles = stepper({ orientation, status: item.status });
    return (
      <span
        {...props}
        className={cx(styles[slot], className)}
        data-slot={`stepper-${slot}`}
        ref={ref}
      />
    );
  });
}

export const StepperTitle = createSpanSlot("title");
export const StepperDescription = createSpanSlot("description");

export const StepperContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function StepperContent({ className, hidden, ...props }, ref) {
    const item = useStepperItemContext();
    const { orientation } = useStepperContext();
    const styles = stepper({ orientation, status: item.status });
    return (
      <div
        {...props}
        className={cx(styles.content, className)}
        data-slot="stepper-content"
        hidden={hidden ?? item.status !== "current"}
        ref={ref}
      />
    );
  },
);

export const StepperSeparator = createSpanSlot("separator");

export interface StepperNavigationButtonProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}

export const StepperPrevious = forwardRef<HTMLButtonElement, StepperNavigationButtonProps>(
  function StepperPrevious(
    { children = "Previous", className, disabled: disabledProp, ...props },
    ref,
  ) {
    const context = useStepperContext();
    const styles = stepper({ orientation: context.orientation });
    return (
      <button
        {...props}
        className={cx(styles.previous, className)}
        data-slot="stepper-previous"
        disabled={disabledProp || context.disabled}
        onClick={(event) => {
          context.move(-1);
          props.onClick?.(event);
        }}
        ref={ref}
        type={props.type ?? "button"}
      >
        {children}
      </button>
    );
  },
);

export const StepperNext = forwardRef<HTMLButtonElement, StepperNavigationButtonProps>(
  function StepperNext({ children = "Next", className, disabled: disabledProp, ...props }, ref) {
    const context = useStepperContext();
    const styles = stepper({ orientation: context.orientation });
    return (
      <button
        {...props}
        className={cx(styles.next, className)}
        data-slot="stepper-next"
        disabled={disabledProp || context.disabled}
        onClick={(event) => {
          context.move(1);
          props.onClick?.(event);
        }}
        ref={ref}
        type={props.type ?? "button"}
      >
        {children}
      </button>
    );
  },
);

export const Stepper = {
  Root: StepperRoot,
  List: StepperList,
  Item: StepperItem,
  Trigger: StepperTrigger,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Content: StepperContent,
  Separator: StepperSeparator,
  Previous: StepperPrevious,
  Next: StepperNext,
};
