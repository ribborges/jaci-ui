import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { paragraph } from "../../styled-system/recipes";

export type ParagraphProps = ComponentPropsWithoutRef<"p">;

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(function Paragraph(
  { className, ...props },
  ref,
) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(paragraph(), className)}
      data-jaci-component="paragraph"
      data-slot="paragraph"
    />
  );
});
