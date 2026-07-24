import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { buttonGroup } from "../../styled-system/recipes";

export interface ButtonGroupProps extends ComponentPropsWithoutRef<"div"> {
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroupRoot = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(buttonGroup({ orientation }).root, className)}
      data-jaci-component="button-group"
      data-orientation={orientation}
      data-slot="button-group"
      role={props.role ?? "group"}
    />
  );
});

export const ButtonGroup = Object.assign(ButtonGroupRoot, { Root: ButtonGroupRoot });
