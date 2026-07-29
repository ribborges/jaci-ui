import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { downloadTrigger } from "../../styled-system/recipes";

export interface DownloadTriggerProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const DownloadTrigger = forwardRef<HTMLAnchorElement, DownloadTriggerProps>(
  function DownloadTrigger(
    { className, disabled = false, href, size = "md", variant = "outline", ...props },
    ref,
  ) {
    return (
      <a
        {...props}
        aria-disabled={disabled || undefined}
        className={cx(downloadTrigger({ size, variant }), className)}
        data-disabled={disabled || undefined}
        data-jaci-component="download-trigger"
        data-slot="download-trigger"
        href={disabled ? undefined : href}
        ref={ref}
        tabIndex={disabled ? -1 : props.tabIndex}
      />
    );
  },
);
