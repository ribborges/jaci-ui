"use client";

import { forwardRef } from "react";
import type { ComponentProps, ComponentPropsWithoutRef, Ref } from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { cx } from "../../styled-system/css";
import { textarea } from "../../styled-system/recipes";
import { useFieldState } from "../field";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  size?: "sm" | "md" | "lg";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size = "md", ...props },
  ref,
) {
  const { insideField } = useFieldState();
  const controlProps = {
    ...props,
    className: cx(textarea({ size }), className),
    "data-jaci-component": "textarea",
    "data-slot": "textarea",
  };

  if (insideField) {
    return (
      <BaseField.Control
        {...(controlProps as unknown as ComponentProps<typeof BaseField.Control>)}
        ref={ref as Ref<HTMLElement>}
        render={<textarea />}
      />
    );
  }

  return <textarea {...controlProps} ref={ref} />;
});
