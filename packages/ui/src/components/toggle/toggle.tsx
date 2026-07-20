"use client";

import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { Toggle as BaseToggleType } from "@base-ui/react/toggle";

import { toggle } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type ToggleVariant = "solid" | "outline" | "ghost";
export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps
  extends Omit<BaseToggleType.Props<string>, "children" | "className" | "onPressedChange"> {
  children?: ReactNode;
  className?: string;
  onPressedChange?: (pressed: boolean) => void;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { children, className, onPressedChange, size = "md", variant = "outline", ...props },
  ref,
) {
  return (
    <BaseToggle
      {...props}
      ref={ref}
      className={withRecipeClassName(toggle({ size, variant }), className)}
      data-jaci-component="toggle"
      data-slot="toggle"
      onPressedChange={(pressed) => onPressedChange?.(pressed)}
    >
      {children}
    </BaseToggle>
  );
});
