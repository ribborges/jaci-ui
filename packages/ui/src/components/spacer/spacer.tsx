import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { layoutSpacer } from "../../styled-system/recipes";

export interface SpacerProps extends ComponentPropsWithoutRef<"div"> {
  axis?: "horizontal" | "vertical";
  size?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  { axis = "vertical", className, size = "md", ...props },
  ref,
) {
  return (
    <div
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      className={cx(layoutSpacer({ axis, size }), className)}
      data-axis={axis}
      data-jaci-component="spacer"
      data-size={size}
      data-slot="spacer"
      ref={ref}
    />
  );
});
