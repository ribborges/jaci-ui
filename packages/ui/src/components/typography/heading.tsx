import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, Ref } from "react";

import { cx } from "../../styled-system/css";
import { heading } from "../../styled-system/recipes";

export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

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
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as = "h2", className, size, ...props },
  ref,
) {
  const Component = as as ElementType;
  const resolvedSize = size ?? defaultSizeByElement[as];

  return (
    <Component
      {...props}
      ref={ref as Ref<HTMLElement>}
      className={cx(heading({ size: resolvedSize }), className)}
      data-jaci-component="heading"
      data-slot="heading"
    />
  ) as ReactElement;
});
