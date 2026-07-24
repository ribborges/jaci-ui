import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { inputGroup } from "../../styled-system/recipes";

export interface InputGroupRootProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export const InputGroupRoot = forwardRef<HTMLDivElement, InputGroupRootProps>(
  function InputGroupRoot({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(inputGroup().root, className)}
        data-jaci-component="input-group"
        data-slot="input-group"
      />
    );
  },
);

export type InputGroupAddonProps = ComponentPropsWithoutRef<"span">;
export const InputGroupAddon = forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  function InputGroupAddon({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cx(inputGroup().addon, className)}
        data-slot="input-group-addon"
      />
    );
  },
);

export const InputGroup = Object.assign(InputGroupRoot, {
  Root: InputGroupRoot,
  Addon: InputGroupAddon,
});
