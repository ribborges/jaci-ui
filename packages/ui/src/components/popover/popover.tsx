"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { PopoverRoot as BasePopoverRoot } from "@base-ui/react/popover";

import { popover } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

/** Preserves Base UI's controlled `open` API and uncontrolled `defaultOpen` API. */
export type PopoverRootProps<Payload = unknown> = BasePopoverRoot.Props<Payload>;

export function PopoverRoot<Payload = unknown>(props: PopoverRootProps<Payload>) {
  return <BasePopover.Root {...props} />;
}

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof BasePopover.Trigger>;

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ className, ...props }, ref) {
    return (
      <BasePopover.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(popover().trigger, className)}
        data-jaci-component="popover"
        data-slot="popover-trigger"
      />
    );
  },
);

/** Preserves Base UI's optional portal container and mount controls. */
export const PopoverPortal: typeof BasePopover.Portal = BasePopover.Portal;

export type PopoverPositionerProps = ComponentPropsWithoutRef<typeof BasePopover.Positioner>;

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(
  function PopoverPositioner({ className, ...props }, ref) {
    return (
      <BasePopover.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(popover().positioner, className)}
        data-slot="popover-positioner"
      />
    );
  },
);

export type PopoverPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;

export const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup(
  { className, ...props },
  ref,
) {
  return (
    <BasePopover.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(popover().popup, className)}
      data-jaci-component="popover"
      data-slot="popover-popup"
    />
  );
});

export type PopoverTitleProps = ComponentPropsWithoutRef<typeof BasePopover.Title>;

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle(
  { className, ...props },
  ref,
) {
  return (
    <BasePopover.Title
      {...props}
      ref={ref}
      className={withRecipeClassName(popover().title, className)}
      data-slot="popover-title"
    />
  );
});

export type PopoverDescriptionProps = ComponentPropsWithoutRef<typeof BasePopover.Description>;

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  function PopoverDescription({ className, ...props }, ref) {
    return (
      <BasePopover.Description
        {...props}
        ref={ref}
        className={withRecipeClassName(popover().description, className)}
        data-slot="popover-description"
      />
    );
  },
);

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof BasePopover.Close>;

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const hasVisibleLabel = children != null;

  return (
    <BasePopover.Close
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Close popover")}
      ref={ref}
      className={withRecipeClassName(popover().close, className)}
      data-slot="popover-close"
    >
      {children ?? "×"}
    </BasePopover.Close>
  );
});

export type PopoverArrowProps = ComponentPropsWithoutRef<typeof BasePopover.Arrow>;

export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(function PopoverArrow(
  { className, ...props },
  ref,
) {
  return (
    <BasePopover.Arrow
      {...props}
      ref={ref}
      className={withRecipeClassName(popover().arrow, className)}
      data-slot="popover-arrow"
    />
  );
});

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Arrow: PopoverArrow,
  createHandle: BasePopover.createHandle,
};
