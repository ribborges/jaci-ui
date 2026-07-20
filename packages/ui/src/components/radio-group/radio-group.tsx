"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { Field as BaseField } from "@base-ui/react/field";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { RadioGroup as BaseRadioGroupType } from "@base-ui/react/radio-group";
import type { RadioRoot as BaseRadioRoot } from "@base-ui/react/radio";

import { cx } from "../../styled-system/css";
import { radioGroup } from "../../styled-system/recipes";
import { Field } from "../field";
import { withRecipeClassName } from "../base-ui";

export interface RadioGroupRootProps<Value = string>
  extends Omit<BaseRadioGroupType.Props<Value>, "children" | "className"> {
  /** Marks the group invalid when an external validator owns its state. */
  invalid?: boolean;
  /** Direct error content rendered through the surrounding Field context. */
  errors?: ReactNode | ReactNode[];
  children?: ReactNode;
  className?: string;
}

/**
 * A typed, accessible radio group. The hidden native input is registered with
 * Jaci Form/Base UI, so `required`, `name`, errors and SSR form submission work
 * without an additional form library.
 */
export function RadioGroupRoot<Value = string>({
  children,
  className,
  errors,
  invalid,
  name,
  ...props
}: RadioGroupRootProps<Value>) {
  const styles = radioGroup();
  const fieldProps = {
    className: cx(styles.root, className),
    ...(errors === undefined ? {} : { errors }),
    ...(invalid === undefined ? {} : { invalid }),
    ...(name === undefined ? {} : { name }),
  };

  return (
    <Field {...fieldProps}>
      <BaseRadioGroup {...props} {...(name === undefined ? {} : { name })}>
        {children}
      </BaseRadioGroup>
    </Field>
  );
}

export type RadioGroupLabelProps = ComponentPropsWithoutRef<typeof BaseField.Label>;

export const RadioGroupLabel = forwardRef<HTMLElement, RadioGroupLabelProps>(
  function RadioGroupLabel({ className, ...props }, ref) {
    return (
      <BaseField.Label
        {...props}
        ref={ref}
        className={withRecipeClassName(radioGroup().label, className)}
        data-slot="radio-group-label"
      />
    );
  },
);

export type RadioGroupOptionProps = ComponentPropsWithoutRef<"label">;

export const RadioGroupOption = forwardRef<HTMLLabelElement, RadioGroupOptionProps>(
  function RadioGroupOption({ children, className, htmlFor, ...props }, ref) {
    return (
      <label
        {...props}
        ref={ref}
        className={cx(radioGroup().option, className)}
        data-slot="radio-group-option"
        htmlFor={htmlFor}
      >
        {children}
      </label>
    );
  },
);

export type RadioGroupOptionsProps = ComponentPropsWithoutRef<"div">;

export const RadioGroupOptions = forwardRef<HTMLDivElement, RadioGroupOptionsProps>(
  function RadioGroupOptions({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(radioGroup().options, className)}
        data-slot="radio-group-options"
      />
    );
  },
);

export type RadioGroupItemProps<Value = string> = BaseRadioRoot.Props<Value>;

export const RadioGroupItem = forwardRef<HTMLSpanElement, RadioGroupItemProps>(
  function RadioGroupItem({ className, ...props }, ref) {
    return (
      <BaseRadio.Root
        {...props}
        ref={ref}
        className={withRecipeClassName(radioGroup().radio, className)}
        data-slot="radio-group-item"
      />
    );
  },
);

export type RadioGroupIndicatorProps = ComponentPropsWithoutRef<typeof BaseRadio.Indicator>;

export const RadioGroupIndicator = forwardRef<HTMLSpanElement, RadioGroupIndicatorProps>(
  function RadioGroupIndicator({ children, className, ...props }, ref) {
    return (
      <BaseRadio.Indicator
        {...props}
        ref={ref}
        className={withRecipeClassName(radioGroup().indicator, className)}
        data-slot="radio-group-indicator"
      >
        {children}
      </BaseRadio.Indicator>
    );
  },
);

export const RadioGroup = {
  Root: RadioGroupRoot,
  Label: RadioGroupLabel,
  Options: RadioGroupOptions,
  Option: RadioGroupOption,
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
};
