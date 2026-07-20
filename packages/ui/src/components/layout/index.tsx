import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { layoutGrid, layoutStack, separator, spinner } from "../../styled-system/recipes";

export type LayoutGap = "none" | "sm" | "md" | "lg" | "xl";
export type LayoutAlign = "start" | "center" | "end" | "stretch";
export type LayoutJustify = "start" | "center" | "end" | "between";
export type LayoutWrap = "wrap" | "nowrap";

export interface StackProps extends ComponentPropsWithoutRef<"div"> {
  direction?: "vertical" | "horizontal";
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  wrap?: LayoutWrap;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    className,
    direction = "vertical",
    gap = "md",
    align = "stretch",
    justify = "start",
    wrap = "nowrap",
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(layoutStack({ direction, gap, align, justify, wrap }), className)}
      data-jaci-component="stack"
      data-slot="stack"
    />
  );
});

export interface FlexProps extends Omit<StackProps, "direction"> {
  direction?: "horizontal" | "vertical";
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  { direction = "horizontal", wrap = "wrap", ...props },
  ref,
) {
  return (
    <Stack {...props} ref={ref} direction={direction} data-jaci-component="flex" wrap={wrap} />
  );
});

export interface GridProps extends ComponentPropsWithoutRef<"div"> {
  columns?: 1 | 2 | 3 | 4;
  gap?: LayoutGap;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { className, columns = 3, gap = "md", ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(
        layoutGrid({ columns: String(columns) as "1" | "2" | "3" | "4", gap }),
        className,
      )}
      data-jaci-component="grid"
      data-slot="grid"
    />
  );
});

export interface SeparatorProps extends Omit<ComponentPropsWithoutRef<"hr">, "orientation"> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  return (
    <hr
      {...props}
      aria-orientation={orientation}
      ref={ref}
      className={cx(separator({ orientation }), className)}
      data-jaci-component="separator"
      data-slot="separator"
    />
  );
});

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, label = "Loading", size = "md", ...props },
  ref,
) {
  return (
    <span
      {...props}
      aria-label={label}
      className={cx(spinner({ size }), className)}
      data-jaci-component="spinner"
      data-slot="spinner"
      ref={ref}
      role="status"
    />
  );
});
