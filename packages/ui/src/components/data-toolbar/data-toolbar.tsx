"use client";

import { createContext, forwardRef, useContext, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { dataToolbar } from "../../styled-system/recipes";

interface SelectionContextValue {
  count: number;
  onClear: (() => void) | undefined;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export type DataToolbarRootProps = ComponentPropsWithoutRef<"div">;
export const DataToolbarRoot = forwardRef<HTMLDivElement, DataToolbarRootProps>(
  function DataToolbarRoot({ className, role, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dataToolbar().root, className)}
        data-jaci-component="data-toolbar"
        data-slot="data-toolbar"
        role={role ?? "toolbar"}
      />
    );
  },
);

export interface DataToolbarSearchProps
  extends Omit<ComponentPropsWithoutRef<"input">, "defaultValue" | "onChange" | "value"> {
  defaultValue?: string;
  onChange?: ComponentPropsWithoutRef<"input">["onChange"];
  onValueChange?: (value: string) => void;
  value?: string;
}

export const DataToolbarSearch = forwardRef<HTMLInputElement, DataToolbarSearchProps>(
  function DataToolbarSearch(
    { className, defaultValue = "", onValueChange, value: controlledValue, ...props },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    return (
      <input
        {...props}
        ref={ref}
        className={cx(dataToolbar().search, className)}
        data-slot="data-toolbar-search"
        onChange={(event) => {
          if (controlledValue === undefined) setUncontrolledValue(event.currentTarget.value);
          onValueChange?.(event.currentTarget.value);
          props.onChange?.(event);
        }}
        type={props.type ?? "search"}
        value={value}
      />
    );
  },
);

export type DataToolbarFiltersProps = ComponentPropsWithoutRef<"div">;
export const DataToolbarFilters = forwardRef<HTMLDivElement, DataToolbarFiltersProps>(
  function DataToolbarFilters({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dataToolbar().filters, className)}
        data-slot="data-toolbar-filters"
      />
    );
  },
);

export interface DataToolbarSortProps
  extends Omit<ComponentPropsWithoutRef<"select">, "defaultValue" | "onChange" | "value"> {
  defaultValue?: string;
  onChange?: ComponentPropsWithoutRef<"select">["onChange"];
  onValueChange?: (value: string) => void;
  value?: string;
}

export const DataToolbarSort = forwardRef<HTMLSelectElement, DataToolbarSortProps>(
  function DataToolbarSort(
    { className, defaultValue = "", onValueChange, value: controlledValue, ...props },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const value = controlledValue ?? uncontrolledValue;
    return (
      <select
        {...props}
        ref={ref}
        className={cx(dataToolbar().sort, className)}
        data-slot="data-toolbar-sort"
        onChange={(event) => {
          if (controlledValue === undefined) setUncontrolledValue(event.currentTarget.value);
          onValueChange?.(event.currentTarget.value);
          props.onChange?.(event);
        }}
        value={value}
      />
    );
  },
);

export interface DataToolbarSelectionProps extends ComponentPropsWithoutRef<"div"> {
  count: number;
  label?: ReactNode;
  onClear?: () => void;
}
export const DataToolbarSelection = forwardRef<HTMLDivElement, DataToolbarSelectionProps>(
  function DataToolbarSelection(
    { children, className, count, label = "selected", onClear, ...props },
    ref,
  ) {
    return (
      <SelectionContext.Provider value={{ count, onClear }}>
        <div
          {...props}
          ref={ref}
          aria-live="polite"
          className={cx(dataToolbar().selection, className)}
          data-count={count}
          data-slot="data-toolbar-selection"
        >
          {children ?? `${count} ${label}`}
        </div>
      </SelectionContext.Provider>
    );
  },
);

export interface DataToolbarClearSelectionProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}
export const DataToolbarClearSelection = forwardRef<
  HTMLButtonElement,
  DataToolbarClearSelectionProps
>(function DataToolbarClearSelection(
  { children = "Clear selection", className, onClick, ...props },
  ref,
) {
  const context = useContext(SelectionContext);
  return (
    <button
      {...props}
      ref={ref}
      className={cx(dataToolbar().clearSelection, className)}
      data-slot="data-toolbar-clear-selection"
      onClick={(event) => {
        context?.onClear?.();
        onClick?.(event);
      }}
      type="button"
    >
      {children}
    </button>
  );
});

export type DataToolbarActionsProps = ComponentPropsWithoutRef<"div">;
export const DataToolbarActions = forwardRef<HTMLDivElement, DataToolbarActionsProps>(
  function DataToolbarActions({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dataToolbar().actions, className)}
        data-slot="data-toolbar-actions"
      />
    );
  },
);

export type DataToolbarClearProps = ComponentPropsWithoutRef<"button">;
export const DataToolbarClear = forwardRef<HTMLButtonElement, DataToolbarClearProps>(
  function DataToolbarClear({ children = "Clear filters", className, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className={cx(dataToolbar().clear, className)}
        data-slot="data-toolbar-clear"
        type="button"
      >
        {children}
      </button>
    );
  },
);

export type DataToolbarSeparatorProps = ComponentPropsWithoutRef<"div">;
export const DataToolbarSeparator = forwardRef<HTMLDivElement, DataToolbarSeparatorProps>(
  function DataToolbarSeparator({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        aria-hidden="true"
        className={cx(dataToolbar().separator, className)}
        data-slot="data-toolbar-separator"
      />
    );
  },
);

export const DataToolbar = {
  Root: DataToolbarRoot,
  Search: DataToolbarSearch,
  Filters: DataToolbarFilters,
  Sort: DataToolbarSort,
  Selection: DataToolbarSelection,
  ClearSelection: DataToolbarClearSelection,
  Actions: DataToolbarActions,
  Clear: DataToolbarClear,
  Separator: DataToolbarSeparator,
};
