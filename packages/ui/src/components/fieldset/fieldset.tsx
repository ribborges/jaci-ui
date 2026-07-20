"use client";

import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import { cx } from "../../styled-system/css";
import { fieldset } from "../../styled-system/recipes";

export interface FieldsetRootProps extends ComponentPropsWithoutRef<"fieldset"> {
  children?: ReactNode;
}

export const FieldsetRoot = forwardRef<HTMLFieldSetElement, FieldsetRootProps>(
  function FieldsetRoot({ children, className, disabled = false, ...props }, ref) {
    const styles = fieldset({ disabled });

    return (
      <BaseFieldset.Root
        {...props}
        ref={ref as Ref<HTMLElement>}
        className={cx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-jaci-component="fieldset"
        data-slot="fieldset"
        disabled={disabled}
      >
        {children}
      </BaseFieldset.Root>
    );
  },
);

export type FieldsetLegendProps = ComponentPropsWithoutRef<"div">;

export const FieldsetLegend = forwardRef<HTMLDivElement, FieldsetLegendProps>(
  function FieldsetLegend({ className, ...props }, ref) {
    return (
      <BaseFieldset.Legend
        {...props}
        ref={ref}
        className={cx(fieldset().legend, className)}
        data-slot="fieldset-legend"
      />
    );
  },
);

export const FieldsetDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<"p">>(
  function FieldsetDescription({ className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        className={cx(fieldset().description, className)}
        data-slot="fieldset-description"
      />
    );
  },
);

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Description: FieldsetDescription,
};
