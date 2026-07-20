"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { radioGroup } from "../../styled-system/recipes";

export type RadioProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "size">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      className={cx(radioGroup().radio, className)}
      data-jaci-component="radio"
      data-slot="radio"
      type="radio"
    />
  );
});
