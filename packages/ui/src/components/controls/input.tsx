"use client";

import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { forwardRef, useState } from "react";

import { cx } from "../../styled-system/css";
import { input, passwordInput } from "../../styled-system/recipes";
import { FieldControl, useFieldState } from "../field";
import { InputGroup } from "../input-group";
import { Spinner } from "../layout";
import { EyeIcon, EyeSlashIcon } from "./password-icons";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "prefix" | "size"> {
  size?: "sm" | "md" | "lg";
  prefix?: ReactNode;
  suffix?: ReactNode;
  loading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, disabled, loading = false, prefix, size = "md", suffix, type, ...props },
  ref,
) {
  const { insideField } = useFieldState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const passwordStyles = passwordInput();
  const controlProps = {
    ...props,
    "aria-busy": loading || undefined,
    className: cx(input({ size }), className),
    "data-jaci-component": "input",
    "data-loading": loading || undefined,
    "data-slot": "input",
    disabled,
    type: isPassword && passwordVisible ? "text" : type,
  };
  const control = insideField ? (
    <FieldControl {...controlProps} ref={ref as Ref<HTMLElement>} />
  ) : (
    <input {...controlProps} ref={ref} />
  );

  const passwordControl = isPassword ? (
    <div className={passwordStyles.control} data-slot="input-password-control">
      {control}
      <button
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        aria-pressed={passwordVisible}
        className={passwordStyles.toggle}
        data-slot="input-password-toggle"
        disabled={disabled}
        onClick={() => setPasswordVisible((visible) => !visible)}
        type="button"
      >
        {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
      </button>
    </div>
  ) : (
    control
  );

  if (prefix !== undefined || suffix !== undefined || loading) {
    return (
      <InputGroup>
        {prefix !== undefined ? (
          <InputGroup.Addon data-slot="input-prefix">{prefix}</InputGroup.Addon>
        ) : null}
        {passwordControl}
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

  return passwordControl;
});
