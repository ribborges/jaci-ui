"use client";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { toast as toastRecipe } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneByToastType: Record<string, ToastTone> = {
  danger: "danger",
  error: "danger",
  info: "info",
  success: "success",
  warning: "warning",
};

function resolveTone(type: string | undefined, tone: ToastTone | undefined): ToastTone {
  return tone ?? (type === undefined ? "neutral" : (toneByToastType[type] ?? "neutral"));
}

export type ToastProviderProps = ComponentPropsWithoutRef<typeof BaseToast.Provider>;

/**
 * Creates an isolated, declarative toast region. Configure `timeout` and
 * `limit` here; use `Toast.Root` to render each toast from local state or
 * `Toast.useToastManager()`.
 */
export function ToastProvider(props: ToastProviderProps) {
  return <BaseToast.Provider {...props} />;
}

export type ToastViewportProps = ComponentPropsWithoutRef<typeof BaseToast.Viewport>;

/**
 * A bottom-centred notification region.
 */
export const ToastViewport = forwardRef<HTMLDivElement, ToastViewportProps>(function ToastViewport(
  { "aria-label": ariaLabel, "aria-live": ariaLive, className, ...props },
  ref,
) {
  return (
    <BaseToast.Viewport
      {...props}
      aria-label={ariaLabel ?? "Notifications"}
      aria-live={ariaLive ?? "polite"}
      ref={ref}
      className={withRecipeClassName(toastRecipe().viewport, className)}
      data-jaci-component="toast-viewport"
      data-slot="toast-viewport"
    />
  );
});

export interface ToastRootProps extends ComponentPropsWithoutRef<typeof BaseToast.Root> {
  /**
   * Visual status. When omitted, the value is inferred from the toast's
   * `type` (`error` maps to `danger`) and otherwise remains neutral.
   */
  tone?: ToastTone;
}

/**
 * Renders a toast object while preserving Base UI's lifecycle, focus, swipe,
 * and auto-dismiss behavior. It is intentionally composed rather than a
 * global imperative notification API.
 */
export const ToastRoot = forwardRef<HTMLDivElement, ToastRootProps>(function ToastRoot(
  { className, toast: toastObject, tone, ...props },
  ref,
) {
  const resolvedTone = resolveTone(toastObject.type, tone);

  return (
    <BaseToast.Root
      {...props}
      ref={ref}
      toast={toastObject}
      className={withRecipeClassName(toastRecipe({ tone: resolvedTone }).root, className)}
      data-jaci-component="toast"
      data-jaci-tone={resolvedTone}
      data-slot="toast"
    />
  );
});

export type ToastContentProps = ComponentPropsWithoutRef<typeof BaseToast.Content>;

export const ToastContent = forwardRef<HTMLDivElement, ToastContentProps>(function ToastContent(
  { className, ...props },
  ref,
) {
  return (
    <BaseToast.Content
      {...props}
      ref={ref}
      className={withRecipeClassName(toastRecipe().content, className)}
      data-slot="toast-content"
    />
  );
});

/** A layout wrapper for `Toast.Title` and `Toast.Description`. */
export type ToastTextProps = ComponentPropsWithoutRef<"div">;

export const ToastText = forwardRef<HTMLDivElement, ToastTextProps>(function ToastText(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(toastRecipe().text, className)}
      data-slot="toast-text"
    />
  );
});

export type ToastTitleProps = ComponentPropsWithoutRef<typeof BaseToast.Title>;

export const ToastTitle = forwardRef<HTMLHeadingElement, ToastTitleProps>(function ToastTitle(
  { className, ...props },
  ref,
) {
  return (
    <BaseToast.Title
      {...props}
      ref={ref}
      className={withRecipeClassName(toastRecipe().title, className)}
      data-slot="toast-title"
    />
  );
});

export type ToastDescriptionProps = ComponentPropsWithoutRef<typeof BaseToast.Description>;

export const ToastDescription = forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  function ToastDescription({ className, ...props }, ref) {
    return (
      <BaseToast.Description
        {...props}
        ref={ref}
        className={withRecipeClassName(toastRecipe().description, className)}
        data-slot="toast-description"
      />
    );
  },
);

export type ToastCloseProps = ComponentPropsWithoutRef<typeof BaseToast.Close>;

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const hasVisibleLabel = children != null;

  return (
    <BaseToast.Close
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Dismiss notification")}
      ref={ref}
      className={withRecipeClassName(toastRecipe().close, className)}
      data-slot="toast-close"
    >
      {children ?? "×"}
    </BaseToast.Close>
  );
});

export type ToastActionProps = ComponentPropsWithoutRef<typeof BaseToast.Action>;

export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(function ToastAction(
  { className, ...props },
  ref,
) {
  return (
    <BaseToast.Action
      {...props}
      ref={ref}
      className={withRecipeClassName(toastRecipe().action, className)}
      data-slot="toast-action"
    />
  );
});

/** Base UI's portal is preserved for rendering the viewport at document level. */
export const ToastPortal: typeof BaseToast.Portal = BaseToast.Portal;

export interface ToastComponent {
  Provider: typeof ToastProvider;
  Viewport: typeof ToastViewport;
  Root: typeof ToastRoot;
  Content: typeof ToastContent;
  Text: typeof ToastText;
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Close: typeof ToastClose;
  Action: typeof ToastAction;
  Portal: typeof ToastPortal;
  useToastManager: typeof BaseToast.useToastManager;
}

export const Toast: ToastComponent = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Text: ToastText,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
  Portal: ToastPortal,
  useToastManager: BaseToast.useToastManager,
};
