import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { paragraph } from "../../styled-system/recipes";
import type { TypographyLineClamp, TypographyWeight, TypographyWidth } from "./heading";

export interface ParagraphProps extends ComponentPropsWithoutRef<"p"> {
  weight?: TypographyWeight;
  truncate?: boolean;
  lineClamp?: TypographyLineClamp;
  width?: TypographyWidth;
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(function Paragraph(
  { className, lineClamp, truncate = false, weight, width = "auto", ...props },
  ref,
) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(
        paragraph({
          lineClamp: lineClamp ? (String(lineClamp) as "1" | "2" | "3" | "4") : undefined,
          truncate,
          weight,
          width,
        }),
        className,
      )}
      data-jaci-component="paragraph"
      data-slot="paragraph"
    />
  );
});
