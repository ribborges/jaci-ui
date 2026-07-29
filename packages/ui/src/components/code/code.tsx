import { Children, forwardRef } from "react";
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
  lineNumbers?: boolean;
}

function getTextLines(children: ReactNode) {
  const nodes = Children.toArray(children);
  if (!nodes.every((node) => typeof node === "string" || typeof node === "number")) return null;
  return nodes.map(String).join("").split("\n");
}

function getLineKeys(lines: readonly string[]) {
  const occurrences = new Map<string, number>();
  return lines.map((line) => {
    const occurrence = occurrences.get(line) ?? 0;
    occurrences.set(line, occurrence + 1);
    return `line-${line}-${occurrence}`;
  });
}

export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  {
    children,
    className,
    language,
    lineNumbers = false,
    truncate = false,
    variant = "inline",
    wrap = false,
    ...props
  },
  ref,
) {
  const lines = variant === "block" && lineNumbers ? getTextLines(children) : null;
  const lineKeys = lines ? getLineKeys(lines) : null;
  const classNames = cx(code({ lineNumbers: Boolean(lines), truncate, variant, wrap }), className);

  if (variant === "block") {
    return (
      <pre
        {...props}
        ref={ref as React.Ref<HTMLPreElement>}
        className={classNames}
        data-jaci-component="code"
        data-language={language || undefined}
        data-line-numbers={lines ? "true" : undefined}
        data-slot="code"
        data-variant={variant}
      >
        {lines ? (
          <span aria-hidden="true" data-slot="code-gutter">
            {lines.map((_, index) => (
              <span data-slot="code-line-number" key={lineKeys?.[index]}>
                {index + 1}
              </span>
            ))}
          </span>
        ) : null}
        <code data-slot="code-content">
          {lines
            ? lines.map((line, index) => (
                <span data-slot="code-line" key={lineKeys?.[index]}>
                  {line}
                  {index < lines.length - 1 ? "\n" : null}
                </span>
              ))
            : children}
        </code>
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
