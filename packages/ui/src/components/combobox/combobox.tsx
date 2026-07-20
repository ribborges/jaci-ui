"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { forwardRef, createContext, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { ComboboxRoot as BaseComboboxRoot } from "@base-ui/react/combobox";
import { Field as BaseField } from "@base-ui/react/field";

import { cx } from "../../styled-system/css";
import { combobox } from "../../styled-system/recipes";
import { Field } from "../field";
import { withRecipeClassName } from "../base-ui";

export type ComboboxSize = "sm" | "md" | "lg";

const ComboboxSizeContext = createContext<ComboboxSize>("md");

function useComboboxStyles() {
  return combobox({ size: useContext(ComboboxSizeContext) });
}

export interface ComboboxRootProps<Value, Multiple extends boolean | undefined = false>
  extends Omit<BaseComboboxRoot.Props<Value, Multiple>, "children" | "className"> {
  /** Visual size shared by the input and trigger. */
  size?: ComboboxSize;
  /** Marks the field invalid when an external validator owns its state. */
  invalid?: boolean;
  /** Direct error content rendered through the surrounding Field context. */
  errors?: ReactNode | ReactNode[];
  children?: ReactNode;
  className?: string;
}

/**
 * A searchable Base UI combobox with Field integration. It supports the
 * controlled `value`/`onValueChange` and uncontrolled `defaultValue` APIs,
 * object values, grouped items, filtering and multiple selection.
 */
export function ComboboxRoot<Value = string, Multiple extends boolean | undefined = false>({
  children,
  className,
  errors,
  invalid,
  name,
  size = "md",
  ...props
}: ComboboxRootProps<Value, Multiple>) {
  const styles = combobox({ size });
  const fieldProps = {
    className: cx(styles.root, className),
    ...(errors === undefined ? {} : { errors }),
    ...(invalid === undefined ? {} : { invalid }),
    ...(name === undefined ? {} : { name }),
  };

  return (
    <ComboboxSizeContext.Provider value={size}>
      <Field {...fieldProps}>
        <BaseCombobox.Root {...props} {...(name === undefined ? {} : { name })}>
          {children}
        </BaseCombobox.Root>
      </Field>
    </ComboboxSizeContext.Provider>
  );
}

export type ComboboxLabelProps = ComponentPropsWithoutRef<typeof BaseField.Label>;

export const ComboboxLabel = forwardRef<HTMLElement, ComboboxLabelProps>(function ComboboxLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseField.Label
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().label, className)}
      data-slot="combobox-label"
    />
  );
});

export type ComboboxInputGroupProps = ComponentPropsWithoutRef<typeof BaseCombobox.InputGroup>;

export const ComboboxInputGroup = forwardRef<HTMLDivElement, ComboboxInputGroupProps>(
  function ComboboxInputGroup({ className, ...props }, ref) {
    return (
      <BaseCombobox.InputGroup
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().inputGroup, className)}
        data-slot="combobox-input-group"
      />
    );
  },
);

export type ComboboxInputProps = ComponentPropsWithoutRef<typeof BaseCombobox.Input>;

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput({ className, ...props }, ref) {
    return (
      <BaseCombobox.Input
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().input, className)}
        data-jaci-component="combobox"
        data-slot="combobox-input"
      />
    );
  },
);

export type ComboboxTriggerProps = ComponentPropsWithoutRef<typeof BaseCombobox.Trigger>;

export const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  function ComboboxTrigger({ className, ...props }, ref) {
    return (
      <BaseCombobox.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().trigger, className)}
        data-slot="combobox-trigger"
      />
    );
  },
);

export type ComboboxIconProps = ComponentPropsWithoutRef<typeof BaseCombobox.Icon>;

export const ComboboxIcon = forwardRef<HTMLSpanElement, ComboboxIconProps>(function ComboboxIcon(
  { children = "⌄", className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Icon
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().icon, className)}
      data-slot="combobox-icon"
    >
      {children}
    </BaseCombobox.Icon>
  );
});

export type ComboboxValueProps = ComponentPropsWithoutRef<typeof BaseCombobox.Value>;
export const ComboboxValue = BaseCombobox.Value;

export const ComboboxPortal = BaseCombobox.Portal;

export type ComboboxPositionerProps = ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>;
export const ComboboxPositioner = forwardRef<HTMLDivElement, ComboboxPositionerProps>(
  function ComboboxPositioner({ className, ...props }, ref) {
    return (
      <BaseCombobox.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().positioner, className)}
        data-slot="combobox-positioner"
      />
    );
  },
);

export type ComboboxPopupProps = ComponentPropsWithoutRef<typeof BaseCombobox.Popup>;
export const ComboboxPopup = forwardRef<HTMLDivElement, ComboboxPopupProps>(function ComboboxPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().popup, className)}
      data-slot="combobox-popup"
    />
  );
});

export type ComboboxListProps = ComponentPropsWithoutRef<typeof BaseCombobox.List>;
export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(function ComboboxList(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.List
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().list, className)}
      data-slot="combobox-list"
    />
  );
});

export type ComboboxItemProps = ComponentPropsWithoutRef<typeof BaseCombobox.Item>;
export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(function ComboboxItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Item
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().item, className)}
      data-slot="combobox-item"
    />
  );
});

export type ComboboxItemIndicatorProps = ComponentPropsWithoutRef<
  typeof BaseCombobox.ItemIndicator
>;
export const ComboboxItemIndicator = forwardRef<HTMLSpanElement, ComboboxItemIndicatorProps>(
  function ComboboxItemIndicator({ children = "✓", className, ...props }, ref) {
    return (
      <BaseCombobox.ItemIndicator
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().itemIndicator, className)}
        data-slot="combobox-item-indicator"
      >
        {children}
      </BaseCombobox.ItemIndicator>
    );
  },
);

export type ComboboxGroupProps = ComponentPropsWithoutRef<typeof BaseCombobox.Group>;
export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(function ComboboxGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Group
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().group, className)}
      data-slot="combobox-group"
    />
  );
});

export type ComboboxGroupLabelProps = ComponentPropsWithoutRef<typeof BaseCombobox.GroupLabel>;
export const ComboboxGroupLabel = forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  function ComboboxGroupLabel({ className, ...props }, ref) {
    return (
      <BaseCombobox.GroupLabel
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().groupLabel, className)}
        data-slot="combobox-group-label"
      />
    );
  },
);

export type ComboboxEmptyProps = ComponentPropsWithoutRef<typeof BaseCombobox.Empty>;
export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(function ComboboxEmpty(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Empty
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().empty, className)}
      data-slot="combobox-empty"
    />
  );
});

export type ComboboxClearProps = ComponentPropsWithoutRef<typeof BaseCombobox.Clear>;
export const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(
  function ComboboxClear({ children = "×", className, ...props }, ref) {
    return (
      <BaseCombobox.Clear
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().clear, className)}
        data-slot="combobox-clear"
        aria-label={props["aria-label"] ?? "Clear selection"}
      >
        {children}
      </BaseCombobox.Clear>
    );
  },
);

export type ComboboxStatusProps = ComponentPropsWithoutRef<typeof BaseCombobox.Status>;
export const ComboboxStatus = forwardRef<HTMLDivElement, ComboboxStatusProps>(
  function ComboboxStatus({ className, ...props }, ref) {
    return (
      <BaseCombobox.Status
        {...props}
        ref={ref}
        className={withRecipeClassName(useComboboxStyles().status, className)}
        data-slot="combobox-status"
      />
    );
  },
);

export type ComboboxArrowProps = ComponentPropsWithoutRef<typeof BaseCombobox.Arrow>;
export const ComboboxArrow = forwardRef<HTMLDivElement, ComboboxArrowProps>(function ComboboxArrow(
  { className, ...props },
  ref,
) {
  return (
    <BaseCombobox.Arrow
      {...props}
      ref={ref}
      className={withRecipeClassName(useComboboxStyles().arrow, className)}
      data-slot="combobox-arrow"
    />
  );
});

export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  InputGroup: ComboboxInputGroup,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Icon: ComboboxIcon,
  Value: ComboboxValue,
  Portal: ComboboxPortal,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Empty: ComboboxEmpty,
  Clear: ComboboxClear,
  Status: ComboboxStatus,
  Arrow: ComboboxArrow,
  useFilter: BaseCombobox.useFilter,
};
