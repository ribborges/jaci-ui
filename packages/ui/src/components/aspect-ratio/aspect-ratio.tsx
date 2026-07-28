import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { aspectRatioBox } from "../../styled-system/recipes";

export interface AspectRatioProps extends ComponentPropsWithoutRef<"div"> {
  ratio?: number;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { className, ratio = 1, style, ...props },
  ref,
) {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;

  return (
    <div
      {...props}
      ref={ref}
      className={cx(aspectRatioBox(), className)}
      data-jaci-component="aspect-ratio"
      data-slot="aspect-ratio"
      style={{ aspectRatio: safeRatio, ...style }}
    />
  );
});
