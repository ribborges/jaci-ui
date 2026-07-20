"use client";

import { cloneElement, forwardRef } from "react";
import type { ComponentPropsWithoutRef, MouseEventHandler, ReactElement, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { button } from "../../styled-system/recipes";
import { Spinner } from "../layout";

type RenderableButtonProps = Record<string, unknown> & {
  children?: ReactNode | undefined;
  className?: string | undefined;
  onClick?: MouseEventHandler<HTMLElement> | undefined;
};

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "color" | "children"> {
  children?: ReactNode;
  variant?: "outline" | "solid" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  render?: ReactElement<RenderableButtonProps>;
}

function content(children: ReactNode, loading: boolean, startIcon: ReactNode, endIcon: ReactNode) {
  return (
    <>
      {loading ? <Spinner aria-hidden="true" label="" size="sm" /> : startIcon}
      {children}
      {!loading ? endIcon : undefined}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = "outline",
    size = "md",
    fullWidth = false,
    loading = false,
    startIcon,
    endIcon,
    disabled,
    render,
    type = "button",
    ...props
  },
  ref,
) {
  const buttonClassName = cx(button({ variant, size, fullWidth }), className);
  const childrenWithIcons = content(children, loading, startIcon, endIcon);

  if (render) {
    const renderedProps = render.props as {
      className?: string;
      children?: ReactNode;
      onClick?: MouseEventHandler<HTMLElement>;
    };

    return cloneElement(render, {
      ...props,
      "aria-busy": loading || undefined,
      "aria-disabled": disabled || loading || undefined,
      className: cx(buttonClassName, renderedProps.className),
      "data-jaci-component": "button",
      "data-slot": "button",
      children: childrenWithIcons,
      onClick: disabled || loading ? undefined : renderedProps.onClick,
    });
  }

  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={buttonClassName}
      data-jaci-component="button"
      data-slot="button"
      disabled={disabled || loading}
      ref={ref}
      type={type}
    >
      {childrenWithIcons}
    </button>
  );
});
