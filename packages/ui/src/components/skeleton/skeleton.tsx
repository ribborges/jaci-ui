import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { skeleton } from "../../styled-system/recipes";

export type SkeletonVariant = "text" | "circle" | "rect";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  variant?: SkeletonVariant;
  /** Disables the pulse while retaining the placeholder's shape. */
  animated?: boolean;
}

/** A decorative loading placeholder; place `aria-busy` on the loading region. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { animated = true, className, variant = "rect", ...props },
  ref,
) {
  return (
    <div
      {...props}
      aria-hidden="true"
      ref={ref}
      className={cx(skeleton({ animated, variant }), className)}
      data-animated={animated || undefined}
      data-jaci-component="skeleton"
      data-slot="skeleton"
      data-variant={variant}
    />
  );
});
