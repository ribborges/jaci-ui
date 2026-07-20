import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { screenReaderOnly } from "../../styled-system/recipes";

export type VisuallyHiddenProps = ComponentPropsWithoutRef<"span">;

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cx(screenReaderOnly(), className)}
        data-jaci-component="visually-hidden"
        data-slot="visually-hidden"
      />
    );
  },
);
