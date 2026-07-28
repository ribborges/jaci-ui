"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { TooltipRoot as BaseTooltipRoot } from "@base-ui/react/tooltip";

import { tooltip } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";

/** Preserves Base UI's controlled `open` API and uncontrolled `defaultOpen` API. */
export type TooltipRootProps<Payload = unknown> = BaseTooltipRoot.Props<Payload>;

export function TooltipRoot<Payload = unknown>(props: TooltipRootProps<Payload>) {
  return <BaseTooltip.Root {...props} />;
}

export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof BaseTooltip.Trigger>;

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  function TooltipTrigger({ className, ...props }, ref) {
    return (
      <BaseTooltip.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(tooltip().trigger, className)}
        data-jaci-component="tooltip"
        data-slot="tooltip-trigger"
      />
    );
  },
);

/** Preserves Base UI's optional portal container and mount controls. */
export function TooltipPortal(props: ComponentPropsWithoutRef<typeof BaseTooltip.Portal>) {
  return <BaseTooltip.Portal {...useThemePortalProps(props)} />;
}

export type TooltipPositionerProps = ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>;

export const TooltipPositioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(
  function TooltipPositioner({ className, ...props }, ref) {
    return (
      <BaseTooltip.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(tooltip().positioner, className)}
        data-slot="tooltip-positioner"
      />
    );
  },
);

export type TooltipPopupProps = ComponentPropsWithoutRef<typeof BaseTooltip.Popup>;

export const TooltipPopup = forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseTooltip.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(tooltip().popup, className)}
      data-jaci-component="tooltip"
      data-slot="tooltip-popup"
    />
  );
});

export type TooltipArrowProps = ComponentPropsWithoutRef<typeof BaseTooltip.Arrow>;

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>(function TooltipArrow(
  { className, ...props },
  ref,
) {
  return (
    <BaseTooltip.Arrow
      {...props}
      ref={ref}
      className={withRecipeClassName(tooltip().arrow, className)}
      data-slot="tooltip-arrow"
    />
  );
});

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Arrow: TooltipArrow,
  createHandle: BaseTooltip.createHandle,
};
