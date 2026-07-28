import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { kbd } from "../../styled-system/recipes";

export type KbdSize = "sm" | "md" | "lg";
export type KbdVariant = "solid" | "outline" | "subtle";

export interface KbdProps extends ComponentPropsWithoutRef<"kbd"> {
  size?: KbdSize;
  variant?: KbdVariant;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, size = "md", variant = "subtle", ...props },
  ref,
) {
  return (
    <kbd
      {...props}
      ref={ref}
      className={cx(kbd({ size, variant }), className)}
      data-jaci-component="kbd"
      data-size={size}
      data-slot="kbd"
      data-variant={variant}
    />
  );
});
