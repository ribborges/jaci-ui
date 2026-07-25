"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { createContext, forwardRef, useContext, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SelectRoot as BaseSelectRoot } from "@base-ui/react/select";

import { cx } from "../../styled-system/css";
import { select } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type SelectSize = "sm" | "md" | "lg";

const SelectSizeContext = createContext<SelectSize>("md");
const SelectAuxContext = createContext<{ clear: () => void; disabled: boolean } | null>(null);

function useSelectStyles() {
  return select({ size: useContext(SelectSizeContext) });
}

/**
 * Groups an accessible listbox select. Use `value`/`onValueChange` for a
 * controlled selection, or `defaultValue` for an uncontrolled selection.
 *
 * `size` is shared by all visual parts so the trigger stays aligned with the
 * library's `Input` component.
 */
export interface SelectRootProps<Value, Multiple extends boolean | undefined = false>
  extends BaseSelectRoot.Props<Value, Multiple> {
  size?: SelectSize;
  loading?: boolean;
}

export function SelectRoot<Value = unknown, Multiple extends boolean | undefined = false>({
  defaultValue,
  disabled = false,
  loading: _loading,
  multiple,
  onValueChange,
  size = "md",
  value: controlledValue,
  ...props
}: SelectRootProps<Value, Multiple>) {
  const [uncontrolledValue, setUncontrolledValue] = useState<unknown>(
    defaultValue ?? (multiple ? [] : null),
  );
  const value = controlledValue === undefined ? uncontrolledValue : controlledValue;
  const clear = () => {
    const nextValue = multiple ? [] : null;
    if (controlledValue === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue as never, undefined as never);
  };
  return (
    <SelectSizeContext.Provider value={size}>
      <SelectAuxContext.Provider value={{ clear, disabled }}>
        <BaseSelect.Root
          {...props}
          disabled={disabled}
          defaultValue={undefined}
          multiple={multiple}
          onValueChange={(nextValue, details) => {
            if (controlledValue === undefined) setUncontrolledValue(nextValue);
            onValueChange?.(nextValue, details);
          }}
          value={value as SelectRootProps<Value, Multiple>["value"]}
        />
      </SelectAuxContext.Provider>
    </SelectSizeContext.Provider>
  );
}

export type SelectLabelProps = ComponentPropsWithoutRef<typeof BaseSelect.Label>;

/** An accessible label that Base UI associates with the trigger automatically. */
export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(function SelectLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Label
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().label, className)}
      data-slot="select-label"
    />
  );
});

export type SelectTriggerProps = ComponentPropsWithoutRef<typeof BaseSelect.Trigger>;

/** The button-shaped control that opens the select popup. */
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, ...props }, ref) {
    return (
      <BaseSelect.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(useSelectStyles().trigger, className)}
        data-jaci-component="select"
        data-slot="select-trigger"
      />
    );
  },
);

export type SelectValueProps = ComponentPropsWithoutRef<typeof BaseSelect.Value>;

/** Renders the selected item's label, or its placeholder when empty. */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Value
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().value, className)}
      data-slot="select-value"
    />
  );
});

export type SelectIconProps = ComponentPropsWithoutRef<typeof BaseSelect.Icon>;

/** A small chevron that rotates while the popup is open. */
export const SelectIcon = forwardRef<HTMLSpanElement, SelectIconProps>(function SelectIcon(
  { children = "⌄", className, ...props },
  ref,
) {
  return (
    <BaseSelect.Icon
      {...props}
      aria-hidden="true"
      ref={ref}
      className={withRecipeClassName(useSelectStyles().icon, className)}
      data-slot="select-icon"
    >
      {children}
    </BaseSelect.Icon>
  );
});

/** Preserves Base UI's optional portal container and mount controls. */
export const SelectPortal = BaseSelect.Portal;

export type SelectPositionerProps = ComponentPropsWithoutRef<typeof BaseSelect.Positioner>;

export const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>(
  function SelectPositioner({ className, ...props }, ref) {
    return (
      <BaseSelect.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(useSelectStyles().positioner, className)}
        data-slot="select-positioner"
      />
    );
  },
);

export type SelectPopupProps = ComponentPropsWithoutRef<typeof BaseSelect.Popup>;

export const SelectPopup = forwardRef<HTMLDivElement, SelectPopupProps>(function SelectPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().popup, className)}
      data-slot="select-popup"
    />
  );
});

export type SelectListProps = ComponentPropsWithoutRef<typeof BaseSelect.List>;

export const SelectList = forwardRef<HTMLDivElement, SelectListProps>(function SelectList(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.List
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().list, className)}
      data-slot="select-list"
    />
  );
});

export type SelectItemProps = ComponentPropsWithoutRef<typeof BaseSelect.Item>;

export const SelectItem = forwardRef<HTMLElement, SelectItemProps>(function SelectItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Item
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().item, className)}
      data-slot="select-item"
    />
  );
});

export type SelectItemTextProps = ComponentPropsWithoutRef<typeof BaseSelect.ItemText>;

export const SelectItemText = forwardRef<HTMLDivElement, SelectItemTextProps>(
  function SelectItemText({ className, ...props }, ref) {
    return (
      <BaseSelect.ItemText
        {...props}
        ref={ref}
        className={withRecipeClassName(useSelectStyles().itemText, className)}
        data-slot="select-item-text"
      />
    );
  },
);

export type SelectItemIndicatorProps = ComponentPropsWithoutRef<typeof BaseSelect.ItemIndicator>;

export const SelectItemIndicator = forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(
  function SelectItemIndicator({ children = "✓", className, ...props }, ref) {
    return (
      <BaseSelect.ItemIndicator
        {...props}
        aria-hidden="true"
        ref={ref}
        className={withRecipeClassName(useSelectStyles().itemIndicator, className)}
        data-slot="select-item-indicator"
      >
        {children}
      </BaseSelect.ItemIndicator>
    );
  },
);

export type SelectGroupProps = ComponentPropsWithoutRef<typeof BaseSelect.Group>;

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseSelect.Group
      {...props}
      ref={ref}
      className={withRecipeClassName(useSelectStyles().group, className)}
      data-slot="select-group"
    />
  );
});

export type SelectGroupLabelProps = ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>;

export const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  function SelectGroupLabel({ className, ...props }, ref) {
    return (
      <BaseSelect.GroupLabel
        {...props}
        ref={ref}
        className={withRecipeClassName(useSelectStyles().groupLabel, className)}
        data-slot="select-group-label"
      />
    );
  },
);

/**
 * A visual separator for groups in a listbox. It is intentionally hidden from
 * assistive technology because ARIA listboxes may only contain options or
 * option groups, not semantic separators.
 */
export interface SelectSeparatorProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
}

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator({ className, orientation = "horizontal", ...props }, ref) {
    return (
      <div
        {...props}
        aria-hidden="true"
        ref={ref}
        className={cx(useSelectStyles().separator, className)}
        data-orientation={orientation}
        data-slot="select-separator"
      />
    );
  },
);

export interface SelectClearProps extends ComponentPropsWithoutRef<"button"> {
  children?: ReactNode;
}
export const SelectClear = forwardRef<HTMLButtonElement, SelectClearProps>(function SelectClear(
  { children = "×", className, ...props },
  ref,
) {
  const context = useContext(SelectAuxContext);
  const styles = useSelectStyles();
  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? "Clear selection"}
      className={cx(styles.clear, className)}
      data-slot="select-clear"
      disabled={props.disabled || context?.disabled}
      onClick={(event) => {
        context?.clear();
        props.onClick?.(event);
      }}
      ref={ref}
      type="button"
    >
      {children}
    </button>
  );
});

export type SelectEmptyProps = ComponentPropsWithoutRef<"div">;
export const SelectEmpty = forwardRef<HTMLDivElement, SelectEmptyProps>(function SelectEmpty(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      className={cx(useSelectStyles().empty, className)}
      data-slot="select-empty"
      ref={ref}
    />
  );
});
export type SelectLoadingProps = ComponentPropsWithoutRef<"div">;
export const SelectLoading = forwardRef<HTMLDivElement, SelectLoadingProps>(function SelectLoading(
  { children = "Loading…", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      aria-live="polite"
      className={cx(useSelectStyles().loading, className)}
      data-slot="select-loading"
      ref={ref}
    >
      {children}
    </div>
  );
});
export type SelectStatusProps = ComponentPropsWithoutRef<"div">;
export const SelectStatus = forwardRef<HTMLDivElement, SelectStatusProps>(function SelectStatus(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      aria-live="polite"
      className={cx(useSelectStyles().status, className)}
      data-slot="select-status"
      ref={ref}
    />
  );
});

export const Select = {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Clear: SelectClear,
  Empty: SelectEmpty,
  Loading: SelectLoading,
  Status: SelectStatus,
};
