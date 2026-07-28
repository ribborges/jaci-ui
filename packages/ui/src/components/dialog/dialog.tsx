"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { DialogRoot as BaseDialogRoot } from "@base-ui/react/dialog";

import { cx } from "../../styled-system/css";
import { dialog } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";

export type DialogSize = "sm" | "md" | "lg";

/**
 * Groups the dialog parts. It supports Base UI's controlled open/onOpenChange
 * API and uncontrolled defaultOpen API.
 */
export type DialogRootProps<Payload = unknown> = BaseDialogRoot.Props<Payload>;

export function DialogRoot<Payload = unknown>(props: DialogRootProps<Payload>) {
  return <BaseDialog.Root {...props} />;
}

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof BaseDialog.Trigger>;

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ className, ...props }, ref) {
    return (
      <BaseDialog.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().trigger, className)}
        data-slot="dialog-trigger"
      />
    );
  },
);

export type DialogPortalProps = ComponentPropsWithoutRef<typeof BaseDialog.Portal>;

/**
 * Preserves Base UI's portal behavior and optional container/ref APIs.
 */
export function DialogPortal(props: DialogPortalProps) {
  return <BaseDialog.Portal {...useThemePortalProps(props)} />;
}

export type DialogBackdropProps = ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>;

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseDialog.Backdrop
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().backdrop, className)}
        data-slot="dialog-backdrop"
      />
    );
  },
);

export type DialogViewportProps = ComponentPropsWithoutRef<typeof BaseDialog.Viewport>;

export const DialogViewport = forwardRef<HTMLDivElement, DialogViewportProps>(
  function DialogViewport({ className, ...props }, ref) {
    return (
      <BaseDialog.Viewport
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().viewport, className)}
        data-slot="dialog-viewport"
      />
    );
  },
);

export interface DialogPopupProps extends ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  size?: DialogSize;
}

export const DialogPopup = forwardRef<HTMLDivElement, DialogPopupProps>(function DialogPopup(
  { className, size = "md", ...props },
  ref,
) {
  return (
    <BaseDialog.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(dialog({ size }).popup, className)}
      data-jaci-component="dialog"
      data-slot="dialog-popup"
    />
  );
});

export type DialogHeaderProps = ComponentPropsWithoutRef<"div">;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(dialog().header, className)}
      data-slot="dialog-header"
    />
  );
});

export type DialogTitleProps = ComponentPropsWithoutRef<typeof BaseDialog.Title>;

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...props },
  ref,
) {
  return (
    <BaseDialog.Title
      {...props}
      ref={ref}
      className={withRecipeClassName(dialog().title, className)}
      data-slot="dialog-title"
    />
  );
});

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof BaseDialog.Description>;

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <BaseDialog.Description
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().description, className)}
        data-slot="dialog-description"
      />
    );
  },
);

export type DialogBodyProps = ComponentPropsWithoutRef<"div">;

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={cx(dialog().body, className)} data-slot="dialog-body" />
  );
});

export type DialogFooterProps = ComponentPropsWithoutRef<"div">;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(dialog().footer, className)}
      data-slot="dialog-footer"
    />
  );
});

export type DialogCloseProps = ComponentPropsWithoutRef<typeof BaseDialog.Close>;

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const hasVisibleLabel = children != null;

  return (
    <BaseDialog.Close
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Close dialog")}
      ref={ref}
      className={withRecipeClassName(hasVisibleLabel ? dialog().action : dialog().close, className)}
      data-slot="dialog-close"
    >
      {children ?? "×"}
    </BaseDialog.Close>
  );
});

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Viewport: DialogViewport,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
  createHandle: BaseDialog.createHandle,
};
