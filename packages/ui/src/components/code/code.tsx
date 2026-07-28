import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { code } from "../../styled-system/recipes";

export type CodeVariant = "inline" | "block";

export interface CodeProps extends Omit<ComponentPropsWithoutRef<"code">, "children"> {
  children?: ReactNode;
  variant?: CodeVariant;
  language?: string;
  wrap?: boolean;
  truncate?: boolean;
}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { children, className, language, truncate = false, variant = "inline", wrap = false, ...props },
  ref,
) {
  const classNames = cx(code({ truncate, variant, wrap }), className);

  if (variant === "block") {
    return (
      <pre
        {...props}
        ref={ref as React.Ref<HTMLPreElement>}
        className={classNames}
        data-jaci-component="code"
        data-language={language || undefined}
        data-slot="code"
        data-variant={variant}
      >
        <code data-slot="code-content">{children}</code>
      </pre>
    );
  }

  return (
    <code
      {...props}
      ref={ref as React.Ref<HTMLElement>}
      className={classNames}
      data-jaci-component="code"
      data-language={language || undefined}
      data-slot="code"
      data-variant={variant}
    >
      {children}
    </code>
  );
});
