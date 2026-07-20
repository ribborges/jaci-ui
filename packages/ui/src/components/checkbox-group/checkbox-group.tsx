"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Field as BaseField } from "@base-ui/react/field";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { CheckboxGroup as BaseCheckboxGroupType } from "@base-ui/react/checkbox-group";
import type { CheckboxRoot as BaseCheckboxRoot } from "@base-ui/react/checkbox";

import { cx } from "../../styled-system/css";
import { checkboxGroup } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { Field } from "../field";

export interface CheckboxGroupRootProps
  extends Omit<BaseCheckboxGroupType.Props, "children" | "className" | "onValueChange"> {
  /** Marks the group invalid when an external validator owns its state. */
  invalid?: boolean;
  /** Direct error content rendered through the surrounding Field context. */
  errors?: ReactNode | ReactNode[];
  children?: ReactNode;
  className?: string;
  name?: string;
  onValueChange?: (value: string[]) => void;
}

export function CheckboxGroupRoot({
  children,
  className,
  errors,
  invalid,
  name,
  onValueChange,
  ...props
}: CheckboxGroupRootProps) {
  const styles = checkboxGroup();
  const fieldProps = {
    className: cx(styles.root, className),
    ...(errors === undefined ? {} : { errors }),
    ...(invalid === undefined ? {} : { invalid }),
    ...(name === undefined ? {} : { name }),
  };

  return (
    <Field {...fieldProps}>
      <BaseCheckboxGroup {...props} onValueChange={(value) => onValueChange?.(value)}>
        {children}
      </BaseCheckboxGroup>
    </Field>
  );
}

export type CheckboxGroupLabelProps = ComponentPropsWithoutRef<typeof BaseField.Label>;

export const CheckboxGroupLabel = forwardRef<HTMLElement, CheckboxGroupLabelProps>(
  function CheckboxGroupLabel({ className, ...props }, ref) {
    return (
      <BaseField.Label
        {...props}
        ref={ref}
        className={withRecipeClassName(checkboxGroup().label, className)}
        data-slot="checkbox-group-label"
      />
    );
  },
);

export type CheckboxGroupOptionProps = ComponentPropsWithoutRef<"label">;

export const CheckboxGroupOption = forwardRef<HTMLLabelElement, CheckboxGroupOptionProps>(
  function CheckboxGroupOption({ children, className, htmlFor, ...props }, ref) {
    return (
      <label
        {...props}
        ref={ref}
        className={cx(checkboxGroup().option, className)}
        data-slot="checkbox-group-option"
        htmlFor={htmlFor}
      >
        {children}
      </label>
    );
  },
);

export type CheckboxGroupOptionsProps = ComponentPropsWithoutRef<"div">;

export const CheckboxGroupOptions = forwardRef<HTMLDivElement, CheckboxGroupOptionsProps>(
  function CheckboxGroupOptions({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(checkboxGroup().options, className)}
        data-slot="checkbox-group-options"
      />
    );
  },
);

export type CheckboxGroupItemProps = BaseCheckboxRoot.Props;

export const CheckboxGroupItem = forwardRef<HTMLElement, CheckboxGroupItemProps>(
  function CheckboxGroupItem({ className, ...props }, ref) {
    return (
      <BaseCheckbox.Root
        {...props}
        ref={ref}
        className={withRecipeClassName(checkboxGroup().checkbox, className)}
        data-slot="checkbox-group-item"
      />
    );
  },
);

export type CheckboxGroupIndicatorProps = ComponentPropsWithoutRef<typeof BaseCheckbox.Indicator>;

export const CheckboxGroupIndicator = forwardRef<HTMLSpanElement, CheckboxGroupIndicatorProps>(
  function CheckboxGroupIndicator({ children, className, ...props }, ref) {
    return (
      <BaseCheckbox.Indicator
        {...props}
        ref={ref}
        className={withRecipeClassName(checkboxGroup().indicator, className)}
        data-slot="checkbox-group-indicator"
      >
        {children ?? "✓"}
      </BaseCheckbox.Indicator>
    );
  },
);

export const CheckboxGroup = {
  Root: CheckboxGroupRoot,
  Label: CheckboxGroupLabel,
  Options: CheckboxGroupOptions,
  Option: CheckboxGroupOption,
  Item: CheckboxGroupItem,
  Indicator: CheckboxGroupIndicator,
};
