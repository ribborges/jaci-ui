import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { link } from "../../styled-system/recipes";

export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  subtle?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, subtle = true, ...props },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      className={cx(link({ subtle }), className)}
      data-jaci-component="link"
      data-slot="link"
    />
  );
});
