"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { AlertDialogRoot as BaseAlertDialogRoot } from "@base-ui/react/alert-dialog";

import { cx } from "../../styled-system/css";
import { dialog } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import type { DialogSize } from "../dialog";

/**
 * A modal confirmation primitive with Base UI's focus trap, Escape handling,
 * and accessible alert-dialog semantics.
 */
export type AlertDialogRootProps<Payload = unknown> = BaseAlertDialogRoot.Props<Payload>;

export function AlertDialogRoot<Payload = unknown>(props: AlertDialogRootProps<Payload>) {
  return <BaseAlertDialog.Root {...props} />;
}

export type AlertDialogTriggerProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Trigger>;

export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().trigger, className)}
        data-slot="alert-dialog-trigger"
      />
    );
  },
);

export type AlertDialogPortalProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Portal>;
export const AlertDialogPortal: typeof BaseAlertDialog.Portal = BaseAlertDialog.Portal;

export type AlertDialogBackdropProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Backdrop>;

export const AlertDialogBackdrop = forwardRef<HTMLDivElement, AlertDialogBackdropProps>(
  function AlertDialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Backdrop
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().backdrop, className)}
        data-slot="alert-dialog-backdrop"
      />
    );
  },
);

export type AlertDialogViewportProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Viewport>;

export const AlertDialogViewport = forwardRef<HTMLDivElement, AlertDialogViewportProps>(
  function AlertDialogViewport({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Viewport
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().viewport, className)}
        data-slot="alert-dialog-viewport"
      />
    );
  },
);

export interface AlertDialogPopupProps
  extends ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup> {
  size?: DialogSize;
}

export const AlertDialogPopup = forwardRef<HTMLDivElement, AlertDialogPopupProps>(
  function AlertDialogPopup({ className, size = "md", ...props }, ref) {
    return (
      <BaseAlertDialog.Popup
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog({ size }).popup, className)}
        data-jaci-component="alert-dialog"
        data-slot="alert-dialog-popup"
      />
    );
  },
);

export type AlertDialogHeaderProps = ComponentPropsWithoutRef<"div">;

export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  function AlertDialogHeader({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dialog().header, className)}
        data-slot="alert-dialog-header"
      />
    );
  },
);

export type AlertDialogTitleProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>;

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Title
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().title, className)}
        data-slot="alert-dialog-title"
      />
    );
  },
);

export type AlertDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof BaseAlertDialog.Description
>;

export const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  function AlertDialogDescription({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Description
        {...props}
        ref={ref}
        className={withRecipeClassName(dialog().description, className)}
        data-slot="alert-dialog-description"
      />
    );
  },
);

export type AlertDialogBodyProps = ComponentPropsWithoutRef<"div">;

export const AlertDialogBody = forwardRef<HTMLDivElement, AlertDialogBodyProps>(
  function AlertDialogBody({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dialog().body, className)}
        data-slot="alert-dialog-body"
      />
    );
  },
);

export type AlertDialogFooterProps = ComponentPropsWithoutRef<"div">;

export const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  function AlertDialogFooter({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dialog().footer, className)}
        data-slot="alert-dialog-footer"
      />
    );
  },
);

export type AlertDialogCloseProps = ComponentPropsWithoutRef<typeof BaseAlertDialog.Close> & {
  "data-slot"?: string;
};

export const AlertDialogClose = forwardRef<HTMLButtonElement, AlertDialogCloseProps>(
  function AlertDialogClose(
    { "aria-label": ariaLabel, children, className, "data-slot": dataSlot, ...props },
    ref,
  ) {
    const hasVisibleLabel = children != null;

    return (
      <BaseAlertDialog.Close
        {...props}
        aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Close alert dialog")}
        ref={ref}
        className={withRecipeClassName(
          hasVisibleLabel ? dialog().action : dialog().close,
          className,
        )}
        data-slot={dataSlot ?? "alert-dialog-close"}
      >
        {children ?? "×"}
      </BaseAlertDialog.Close>
    );
  },
);

export type AlertDialogCancelProps = AlertDialogCloseProps;

export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  function AlertDialogCancel({ children = "Cancel", ...props }, ref) {
    return (
      <AlertDialogClose {...props} ref={ref} data-slot="alert-dialog-cancel">
        {children}
      </AlertDialogClose>
    );
  },
);

export type AlertDialogActionProps = AlertDialogCloseProps;

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  function AlertDialogAction({ children = "Continue", ...props }, ref) {
    return (
      <AlertDialogClose {...props} ref={ref} data-slot="alert-dialog-action">
        {children}
      </AlertDialogClose>
    );
  },
);

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Viewport: AlertDialogViewport,
  Popup: AlertDialogPopup,
  Header: AlertDialogHeader,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Close: AlertDialogClose,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
  createHandle: BaseAlertDialog.createHandle,
};
