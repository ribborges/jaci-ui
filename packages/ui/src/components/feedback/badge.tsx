import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { badge } from "../../styled-system/recipes";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = "neutral", ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(badge({ tone }), className)}
      data-jaci-component="badge"
      data-slot="badge"
    />
  );
});
