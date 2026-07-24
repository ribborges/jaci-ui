"use client";

import { Children, forwardRef, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { iconButton } from "../../styled-system/recipes";
import { Spinner } from "../layout";

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "color"> {
  children?: ReactNode;
  variant?: "solid" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

function hasTextualContent(children: ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number") {
    return String(children).trim().length > 0;
  }

  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    return hasTextualContent((child.props as { children?: ReactNode }).children);
  });
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, disabled, loading = false, size = "md", variant = "outline", ...props },
  ref,
) {
  if (!hasTextualContent(children) && !props["aria-label"] && !props["aria-labelledby"]) {
    throw new Error("IconButton requires an aria-label when it has no textual content.");
  }

  return (
    <button
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      className={cx(iconButton({ size, variant }), className)}
      data-jaci-component="icon-button"
      data-loading={loading || undefined}
      data-slot="icon-button"
      disabled={disabled || loading}
      type={props.type ?? "button"}
    >
      {loading ? <Spinner aria-hidden="true" label="" size="sm" /> : children}
    </button>
  );
});
