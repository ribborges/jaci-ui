"use client";

import { forwardRef } from "react";
import type { ComponentProps, ComponentPropsWithoutRef, ReactNode, Ref } from "react";

import { cx } from "../../styled-system/css";
import { textarea } from "../../styled-system/recipes";
import { FieldControl, useFieldState } from "../field";
import { InputGroup } from "../input-group";
import { Spinner } from "../layout";

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "prefix"> {
  size?: "sm" | "md" | "lg";
  prefix?: ReactNode;
  suffix?: ReactNode;
  loading?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, loading = false, prefix, size = "md", suffix, ...props },
  ref,
) {
  const { insideField } = useFieldState();
  const controlProps = {
    ...props,
    "aria-busy": loading || undefined,
    className: cx(textarea({ size }), className),
    "data-jaci-component": "textarea",
    "data-loading": loading || undefined,
    "data-slot": "textarea",
  };
  const control = insideField ? (
    <FieldControl
      {...(controlProps as unknown as ComponentProps<typeof FieldControl>)}
      ref={ref as Ref<HTMLElement>}
      render={<textarea />}
    />
  ) : (
    <textarea {...controlProps} ref={ref} />
  );

  if (prefix !== undefined || suffix !== undefined || loading) {
    return (
      <InputGroup>
        {prefix !== undefined ? (
          <InputGroup.Addon data-slot="textarea-prefix">{prefix}</InputGroup.Addon>
        ) : null}
        {control}
        {loading ? (
          <InputGroup.Addon aria-hidden="true" data-slot="textarea-loading">
            <Spinner label="" size="sm" />
          </InputGroup.Addon>
        ) : suffix !== undefined ? (
          <InputGroup.Addon data-slot="textarea-suffix">{suffix}</InputGroup.Addon>
        ) : null}
      </InputGroup>
    );
  }

  return control;
});
