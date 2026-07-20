"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { withRecipeClassName } from "../base-ui";
import { cx } from "../../styled-system/css";
import { collapsible } from "../../styled-system/recipes";

export type CollapsibleRootProps = ComponentPropsWithoutRef<typeof BaseCollapsible.Root>;

export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>(
  function CollapsibleRoot({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Root
        {...props}
        ref={ref}
        className={withRecipeClassName(collapsible().root, className)}
        data-jaci-component="collapsible"
        data-slot="collapsible"
      />
    );
  },
);

export interface CollapsibleTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> {
  showIndicator?: boolean;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ children, className, showIndicator = true, ...props }, ref) {
    const styles = collapsible();

    return (
      <BaseCollapsible.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-slot="collapsible-trigger"
      >
        {showIndicator ? <CollapsibleIndicator /> : null}
        {children}
      </BaseCollapsible.Trigger>
    );
  },
);

export type CollapsiblePanelProps = ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>;

export const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ className, ...props }, ref) {
    return (
      <BaseCollapsible.Panel
        {...props}
        ref={ref}
        className={withRecipeClassName(collapsible().panel, className)}
        data-slot="collapsible-panel"
      />
    );
  },
);

export type CollapsibleIndicatorProps = ComponentPropsWithoutRef<"span">;

export const CollapsibleIndicator = forwardRef<HTMLSpanElement, CollapsibleIndicatorProps>(
  function CollapsibleIndicator({ children = "›", className, ...props }, ref) {
    return (
      <span
        {...props}
        aria-hidden="true"
        ref={ref}
        className={cx(collapsible().indicator, className)}
        data-slot="collapsible-indicator"
      >
        {children}
      </span>
    );
  },
);

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  Indicator: CollapsibleIndicator,
};
