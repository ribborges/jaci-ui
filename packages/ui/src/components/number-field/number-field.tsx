"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Field as BaseField } from "@base-ui/react/field";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { NumberFieldRoot as BaseNumberFieldRoot } from "@base-ui/react/number-field";

import { cx } from "../../styled-system/css";
import { numberField } from "../../styled-system/recipes";
import { Field } from "../field";
import { withRecipeClassName } from "../base-ui";

export type NumberFieldSize = "sm" | "md" | "lg";

const NumberFieldSizeContext = createContext<NumberFieldSize>("md");

function useNumberFieldStyles() {
  return numberField({ size: useContext(NumberFieldSizeContext) });
}

export interface NumberFieldRootProps
  extends Omit<BaseNumberFieldRoot.Props, "children" | "className"> {
  /** Shared visual size for the input and stepper buttons. */
  size?: NumberFieldSize;
  /** Marks the field invalid when an external validator owns its state. */
  invalid?: boolean;
  /** Direct error content rendered through the surrounding Field context. */
  errors?: ReactNode | ReactNode[];
  children?: ReactNode;
  className?: string;
}

/**
 * A locale-aware numeric field with keyboard, wheel and button stepping.
 * It supports the controlled `value`/`onValueChange` and uncontrolled
 * `defaultValue` APIs while preserving native form submission.
 */
export function NumberFieldRoot({
  children,
  className,
  disabled,
  errors,
  invalid,
  name,
  size = "md",
  ...props
}: NumberFieldRootProps) {
  const styles = numberField({ size });
  const fieldProps = {
    className: cx(styles.root, className),
    ...(disabled === undefined ? {} : { disabled }),
    ...(errors === undefined ? {} : { errors }),
    ...(invalid === undefined ? {} : { invalid }),
    ...(name === undefined ? {} : { name }),
  };

  return (
    <NumberFieldSizeContext.Provider value={size}>
      <Field {...fieldProps}>
        <BaseNumberField.Root
          {...props}
          {...(disabled === undefined ? {} : { disabled })}
          {...(name === undefined ? {} : { name })}
          data-jaci-component="number-field"
          data-slot="number-field"
        >
          {children}
        </BaseNumberField.Root>
      </Field>
    </NumberFieldSizeContext.Provider>
  );
}

export type NumberFieldLabelProps = ComponentPropsWithoutRef<typeof BaseField.Label>;

export const NumberFieldLabel = forwardRef<HTMLElement, NumberFieldLabelProps>(
  function NumberFieldLabel({ className, ...props }, ref) {
    return (
      <BaseField.Label
        {...props}
        ref={ref}
        className={withRecipeClassName(useNumberFieldStyles().label, className)}
        data-slot="number-field-label"
      />
    );
  },
);

export type NumberFieldGroupProps = ComponentPropsWithoutRef<typeof BaseNumberField.Group>;

export const NumberFieldGroup = forwardRef<HTMLDivElement, NumberFieldGroupProps>(
  function NumberFieldGroup({ className, ...props }, ref) {
    return (
      <BaseNumberField.Group
        {...props}
        ref={ref}
        className={withRecipeClassName(useNumberFieldStyles().group, className)}
        data-slot="number-field-group"
      />
    );
  },
);

export type NumberFieldInputProps = ComponentPropsWithoutRef<typeof BaseNumberField.Input>;

export const NumberFieldInput = forwardRef<HTMLInputElement, NumberFieldInputProps>(
  function NumberFieldInput({ className, ...props }, ref) {
    return (
      <BaseNumberField.Input
        {...props}
        ref={ref}
        className={withRecipeClassName(useNumberFieldStyles().input, className)}
        data-slot="number-field-input"
      />
    );
  },
);

export type NumberFieldIncrementProps = ComponentPropsWithoutRef<typeof BaseNumberField.Increment>;

export const NumberFieldIncrement = forwardRef<HTMLButtonElement, NumberFieldIncrementProps>(
  function NumberFieldIncrement(
    { "aria-label": ariaLabel, children = "+", className, ...props },
    ref,
  ) {
    return (
      <BaseNumberField.Increment
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? "Increase value"}
        className={withRecipeClassName(useNumberFieldStyles().increment, className)}
        data-slot="number-field-increment"
      >
        {children}
      </BaseNumberField.Increment>
    );
  },
);

export type NumberFieldDecrementProps = ComponentPropsWithoutRef<typeof BaseNumberField.Decrement>;

export const NumberFieldDecrement = forwardRef<HTMLButtonElement, NumberFieldDecrementProps>(
  function NumberFieldDecrement(
    { "aria-label": ariaLabel, children = "−", className, ...props },
    ref,
  ) {
    return (
      <BaseNumberField.Decrement
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? "Decrease value"}
        className={withRecipeClassName(useNumberFieldStyles().decrement, className)}
        data-slot="number-field-decrement"
      >
        {children}
      </BaseNumberField.Decrement>
    );
  },
);

export type NumberFieldScrubAreaProps = ComponentPropsWithoutRef<typeof BaseNumberField.ScrubArea>;

export const NumberFieldScrubArea = forwardRef<HTMLSpanElement, NumberFieldScrubAreaProps>(
  function NumberFieldScrubArea({ className, ...props }, ref) {
    return (
      <BaseNumberField.ScrubArea
        {...props}
        ref={ref}
        className={withRecipeClassName(useNumberFieldStyles().scrubArea, className)}
        data-slot="number-field-scrub-area"
      />
    );
  },
);

export type NumberFieldScrubAreaCursorProps = ComponentPropsWithoutRef<
  typeof BaseNumberField.ScrubAreaCursor
>;

export const NumberFieldScrubAreaCursor = forwardRef<
  HTMLSpanElement,
  NumberFieldScrubAreaCursorProps
>(function NumberFieldScrubAreaCursor({ className, ...props }, ref) {
  return (
    <BaseNumberField.ScrubAreaCursor
      {...props}
      ref={ref}
      className={withRecipeClassName(useNumberFieldStyles().scrubAreaCursor, className)}
      data-slot="number-field-scrub-area-cursor"
    />
  );
});

export const NumberField = {
  Root: NumberFieldRoot,
  Label: NumberFieldLabel,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
  ScrubArea: NumberFieldScrubArea,
  ScrubAreaCursor: NumberFieldScrubAreaCursor,
};
