import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from "react";

import { cx } from "../../styled-system/css";
import { text } from "../../styled-system/recipes";

export type TextSize = "sm" | "md" | "lg";
export type TextTone = "default" | "muted";
export type TextElement = "p" | "span" | "div";

export interface TextProps extends Omit<ComponentPropsWithoutRef<"p">, "color"> {
  as?: TextElement;
  size?: TextSize;
  tone?: TextTone;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = "p", className, size = "md", tone = "default", ...props },
  ref,
) {
  const Component = as as ElementType;

  return (
    <Component
      {...props}
      ref={ref as Ref<HTMLElement>}
      className={cx(text({ size, tone }), className)}
      data-jaci-component="text"
      data-slot="text"
    />
  ) as ReactElement;
});
