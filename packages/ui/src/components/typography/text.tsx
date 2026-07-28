import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from "react";
import type { TypographyLineClamp, TypographyWeight, TypographyWidth } from "./heading";

import { cx } from "../../styled-system/css";
import { text } from "../../styled-system/recipes";

export type TextSize = "sm" | "md" | "lg";
export type TextTone = "default" | "muted";
export type TextElement = "p" | "span" | "div";

export interface TextProps extends Omit<ComponentPropsWithoutRef<"p">, "color"> {
  as?: TextElement;
  size?: TextSize;
  tone?: TextTone;
  weight?: TypographyWeight;
  truncate?: boolean;
  lineClamp?: TypographyLineClamp;
  width?: TypographyWidth;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as = "p",
    className,
    lineClamp,
    size = "md",
    tone = "default",
    truncate = false,
    weight,
    width = "auto",
    ...props
  },
  ref,
) {
  const Component = as as ElementType;

  return (
    <Component
      {...props}
      ref={ref as Ref<HTMLElement>}
      className={cx(
        text({
          lineClamp: lineClamp ? (String(lineClamp) as "1" | "2" | "3" | "4") : undefined,
          size,
          tone,
          truncate,
          weight,
          width,
        }),
        className,
      )}
      data-jaci-component="text"
      data-slot="text"
    />
  ) as ReactElement;
});
