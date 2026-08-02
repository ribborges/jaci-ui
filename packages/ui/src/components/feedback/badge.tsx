import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { badge } from "../../styled-system/recipes";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** Use `custom` when the color should be provided by a className or CSS module. */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "custom";
  variant?: "solid" | "soft" | "outline";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = "neutral", variant = "solid", ...props },
  ref,
) {
  const appearance = `${tone}-${variant}` as
    | "neutral-solid"
    | "accent-solid"
    | "success-solid"
    | "warning-solid"
    | "danger-solid"
    | "neutral-soft"
    | "accent-soft"
    | "success-soft"
    | "warning-soft"
    | "danger-soft"
    | "neutral-outline"
    | "accent-outline"
    | "success-outline"
    | "warning-outline"
    | "danger-outline"
    | "custom-solid"
    | "custom-soft"
    | "custom-outline";

  return (
    <span
      {...props}
      ref={ref}
      className={cx(badge({ tone: appearance }), className)}
      data-jaci-component="badge"
      data-jaci-tone={tone}
      data-slot="badge"
      data-variant={variant}
    />
  );
});
