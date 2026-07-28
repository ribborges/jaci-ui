import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from "react";

import { cx } from "../../styled-system/css";
import { heading } from "../../styled-system/recipes";

export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";
export type TypographyWidth = "auto" | "fit" | "full";
export type TypographyLineClamp = 1 | 2 | 3 | 4;

const defaultSizeByElement: Record<HeadingElement, HeadingSize> = {
  h1: "2xl",
  h2: "xl",
  h3: "lg",
  h4: "md",
  h5: "sm",
  h6: "xs",
};

export interface HeadingProps extends Omit<ComponentPropsWithoutRef<"h2">, "color"> {
  as?: HeadingElement;
  size?: HeadingSize;
  weight?: TypographyWeight;
  truncate?: boolean;
  lineClamp?: TypographyLineClamp;
  width?: TypographyWidth;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as = "h2", className, lineClamp, size, truncate = false, weight, width = "auto", ...props },
  ref,
) {
  const Component = as as ElementType;
  const resolvedSize = size ?? defaultSizeByElement[as];

  return (
    <Component
      {...props}
      ref={ref as Ref<HTMLElement>}
      className={cx(
        heading({
          lineClamp: lineClamp ? (String(lineClamp) as "1" | "2" | "3" | "4") : undefined,
          size: resolvedSize,
          truncate,
          weight,
          width,
        }),
        className,
      )}
      data-jaci-component="heading"
      data-slot="heading"
    />
  ) as ReactElement;
});
