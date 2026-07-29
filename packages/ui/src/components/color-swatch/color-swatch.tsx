import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { colorSwatch } from "../../styled-system/recipes";

export interface ColorSwatchProps extends ComponentPropsWithoutRef<"span"> {
  color: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  border?: boolean;
  label?: string;
}

export const ColorSwatch = forwardRef<HTMLSpanElement, ColorSwatchProps>(function ColorSwatch(
  { border = true, className, color, label, shape = "circle", size = "md", style, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      {...(label ? { "aria-label": label, role: "img" as const } : {})}
      className={cx(colorSwatch({ border, shape, size }), className)}
      data-color={color}
      data-jaci-component="color-swatch"
      data-shape={shape}
      data-size={size}
      data-slot="color-swatch"
      style={{ backgroundColor: color, ...style }}
    />
  );
});
