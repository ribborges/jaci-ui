"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { AccordionRoot as BaseAccordionRoot } from "@base-ui/react/accordion";

import { withRecipeClassName } from "../base-ui";
import { cx } from "../../styled-system/css";
import { accordion } from "../../styled-system/recipes";

export type AccordionRootProps<Value = unknown> = BaseAccordionRoot.Props<Value>;

/**
 * Groups disclosure items. Use `value`/`onValueChange` for a controlled root,
 * or `defaultValue` for an uncontrolled one.
 */
export function AccordionRoot<Value = unknown>({ className, ...props }: AccordionRootProps<Value>) {
  const styles = accordion();

  return (
    <BaseAccordion.Root
      {...props}
      className={withRecipeClassName(styles.root, className)}
      data-jaci-component="accordion"
      data-slot="accordion"
    />
  );
}

export type AccordionItemProps = ComponentPropsWithoutRef<typeof BaseAccordion.Item>;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Item
      {...props}
      ref={ref}
      className={withRecipeClassName(accordion().item, className)}
      data-slot="accordion-item"
    />
  );
});

export type AccordionHeaderProps = ComponentPropsWithoutRef<typeof BaseAccordion.Header>;

export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader({ className, ...props }, ref) {
    return (
      <BaseAccordion.Header
        {...props}
        ref={ref}
        className={withRecipeClassName(accordion().header, className)}
        data-slot="accordion-header"
      />
    );
  },
);

export interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof BaseAccordion.Trigger> {
  showIndicator?: boolean;
}

export const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(
  function AccordionTrigger({ children, className, showIndicator = true, ...props }, ref) {
    const styles = accordion();

    return (
      <BaseAccordion.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-slot="accordion-trigger"
      >
        {showIndicator ? <AccordionIndicator /> : null}
        {children}
      </BaseAccordion.Trigger>
    );
  },
);

export type AccordionPanelProps = ComponentPropsWithoutRef<typeof BaseAccordion.Panel>;

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, ...props }, ref) {
    return (
      <BaseAccordion.Panel
        {...props}
        ref={ref}
        className={withRecipeClassName(accordion().panel, className)}
        data-slot="accordion-panel"
      />
    );
  },
);

export type AccordionIndicatorProps = ComponentPropsWithoutRef<"span">;

export const AccordionIndicator = forwardRef<HTMLSpanElement, AccordionIndicatorProps>(
  function AccordionIndicator({ children = "›", className, ...props }, ref) {
    return (
      <span
        {...props}
        aria-hidden="true"
        ref={ref}
        className={cx(accordion().indicator, className)}
        data-slot="accordion-indicator"
      >
        {children}
      </span>
    );
  },
);

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
  Indicator: AccordionIndicator,
};
