"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { forwardRef } from "react";
import type { ReactNode, Ref } from "react";
import type { CheckboxRoot as BaseCheckboxRoot } from "@base-ui/react/checkbox";

import { checkbox } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}

export interface CheckboxProps
  extends Omit<BaseCheckboxRoot.Props, "children" | "className" | "onCheckedChange" | "onChange"> {
  className?: string;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, className, inputRef, onCheckedChange, ...props },
  ref,
) {
  const styles = checkbox();

  return (
    <BaseCheckbox.Root
      {...props}
      inputRef={mergeRefs(ref, inputRef)}
      onCheckedChange={(checked) => onCheckedChange?.(checked)}
      className={withRecipeClassName(styles.root, className)}
      data-jaci-component="checkbox"
      data-slot="checkbox"
    >
      <BaseCheckbox.Indicator
        className={withRecipeClassName(styles.indicator, undefined)}
        data-slot="checkbox-indicator"
      >
        {children ?? "✓"}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
