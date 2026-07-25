"use client";

import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, Ref } from "react";
import type { ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { input } from "../../styled-system/recipes";
import { FieldControl, useFieldState } from "../field";
import { InputGroup } from "../input-group";
import { Spinner } from "../layout";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "prefix" | "size"> {
  size?: "sm" | "md" | "lg";
  prefix?: ReactNode;
  suffix?: ReactNode;
  loading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, loading = false, prefix, size = "md", suffix, ...props },
  ref,
) {
  const { insideField } = useFieldState();
  const controlProps = {
    ...props,
    "aria-busy": loading || undefined,
    className: cx(input({ size }), className),
    "data-jaci-component": "input",
    "data-loading": loading || undefined,
    "data-slot": "input",
  };
  const control = insideField ? (
    <FieldControl {...controlProps} ref={ref as Ref<HTMLElement>} />
  ) : (
    <input {...controlProps} ref={ref} />
  );

  if (prefix !== undefined || suffix !== undefined || loading) {
    return (
      <InputGroup>
        {prefix !== undefined ? (
          <InputGroup.Addon data-slot="input-prefix">{prefix}</InputGroup.Addon>
        ) : null}
        {control}
        {loading ? (
          <InputGroup.Addon aria-hidden="true" data-slot="input-loading">
            <Spinner label="" size="sm" />
          </InputGroup.Addon>
        ) : suffix !== undefined ? (
          <InputGroup.Addon data-slot="input-suffix">{suffix}</InputGroup.Addon>
        ) : null}
      </InputGroup>
    );
  }

  return control;
});
