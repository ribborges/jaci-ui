"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, Ref } from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { cx } from "../../styled-system/css";
import { input } from "../../styled-system/recipes";
import { useFieldState } from "../field";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", ...props },
  ref,
) {
  const { insideField } = useFieldState();
  const controlProps = {
    ...props,
    className: cx(input({ size }), className),
    "data-jaci-component": "input",
    "data-slot": "input",
  };

  if (insideField) {
    return <BaseField.Control {...controlProps} ref={ref as Ref<HTMLElement>} />;
  }

  return <input {...controlProps} ref={ref} />;
});
