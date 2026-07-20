"use client";

import { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, MouseEvent, MouseEventHandler, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { copyable } from "../../styled-system/recipes";

interface CopyableContextValue {
  copied: boolean;
  copiedLabel: string;
  styles: ReturnType<typeof copyable>;
}

const CopyableContext = createContext<CopyableContextValue | null>(null);

function useCopyableContext() {
  const context = useContext(CopyableContext);
  if (!context) {
    throw new Error("Copyable parts must be rendered inside Copyable.Root.");
  }

  return context;
}

async function copyToClipboard(value: string) {
  let primaryError: unknown;

  if (typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function") {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (error) {
      primaryError = error;
    }
  }

  if (typeof document !== "undefined" && typeof document.execCommand === "function") {
    const textarea = document.createElement("textarea");
    const selection = document.getSelection();
    const ranges = selection
      ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index))
      : [];

    textarea.value = value;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      if (document.execCommand("copy")) {
        return;
      }
    } finally {
      textarea.remove();
      selection?.removeAllRanges();
      for (const range of ranges) {
        selection?.addRange(range);
      }
    }
  }

  throw primaryError instanceof Error
    ? primaryError
    : new Error("Clipboard access is unavailable.");
}

export interface CopyableRootProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick" | "onCopy"> {
  children?: ReactNode;
  copiedDuration?: number;
  copiedLabel?: string;
  copyLabel?: string;
  onCopy?: (value: string) => void;
  onError?: (error: unknown) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  value: string;
}

export const CopyableRoot = forwardRef<HTMLButtonElement, CopyableRootProps>(function CopyableRoot(
  {
    "aria-label": ariaLabel,
    children,
    className,
    copiedDuration = 1500,
    copiedLabel = "Copied",
    copyLabel = "Copy to clipboard",
    disabled = false,
    onClick,
    onCopy,
    onError,
    value,
    ...props
  },
  ref,
) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const styles = copyable();

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await copyToClipboard(value);
      setCopied(true);
      onCopy?.(value);
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopied(false), copiedDuration);
    } catch (error) {
      setCopied(false);
      onError?.(error);
    }
  }

  return (
    <CopyableContext.Provider value={{ copied, copiedLabel, styles }}>
      <button
        {...props}
        ref={ref}
        aria-label={ariaLabel ?? copyLabel}
        className={cx(styles.root, className)}
        data-copied={copied || undefined}
        data-disabled={disabled || undefined}
        data-jaci-component="copyable"
        data-slot="copyable"
        disabled={disabled}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            void handleCopy();
          }
        }}
        type="button"
      >
        {children ?? <CopyableContent>{value}</CopyableContent>}
        <span aria-live="polite" className={styles.status} data-slot="copyable-status">
          {copied ? copiedLabel : ""}
        </span>
      </button>
    </CopyableContext.Provider>
  );
});

export interface CopyableContentProps extends Omit<ComponentPropsWithoutRef<"code">, "as"> {
  as?: "code" | "span";
}

export const CopyableContent = forwardRef<HTMLElement, CopyableContentProps>(
  function CopyableContent({ as = "code", className, ...props }, ref) {
    const { styles } = useCopyableContext();
    const Component = as;

    return (
      <Component
        {...props}
        ref={ref as never}
        className={cx(styles.content, className)}
        data-slot="copyable-content"
      />
    );
  },
);

export type CopyableIndicatorProps = ComponentPropsWithoutRef<"span">;

export const CopyableIndicator = forwardRef<HTMLSpanElement, CopyableIndicatorProps>(
  function CopyableIndicator({ children, className, ...props }, ref) {
    const { copied, copiedLabel, styles } = useCopyableContext();

    return (
      <span
        {...props}
        ref={ref}
        aria-hidden={props["aria-hidden"] ?? true}
        className={cx(styles.indicator, className)}
        data-copied={copied || undefined}
        data-slot="copyable-indicator"
      >
        {children ?? (copied ? copiedLabel : "Copy")}
      </span>
    );
  },
);

export const Copyable = {
  Root: CopyableRoot,
  Content: CopyableContent,
  Indicator: CopyableIndicator,
};
