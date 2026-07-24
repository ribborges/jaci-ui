import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { emptyState } from "../../styled-system/recipes";

export type EmptyStateRootProps = ComponentPropsWithoutRef<"section">;

export const EmptyStateRoot = forwardRef<HTMLElement, EmptyStateRootProps>(function EmptyStateRoot(
  { className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      className={cx(emptyState().root, className)}
      data-jaci-component="empty-state"
      data-slot="empty-state"
    />
  );
});

export const EmptyStateIcon = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function EmptyStateIcon({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(emptyState().icon, className)}
        data-slot="empty-state-icon"
      />
    );
  },
);

export const EmptyStateTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h3">>(
  function EmptyStateTitle({ className, ...props }, ref) {
    return (
      <h3
        {...props}
        ref={ref}
        className={cx(emptyState().title, className)}
        data-slot="empty-state-title"
      />
    );
  },
);

export const EmptyStateDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(function EmptyStateDescription({ className, ...props }, ref) {
  return (
    <p
      {...props}
      ref={ref}
      className={cx(emptyState().description, className)}
      data-slot="empty-state-description"
    />
  );
});

export const EmptyStateAction = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function EmptyStateAction({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(emptyState().action, className)}
        data-slot="empty-state-action"
      />
    );
  },
);

export const EmptyState = Object.assign(EmptyStateRoot, {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Action: EmptyStateAction,
});
