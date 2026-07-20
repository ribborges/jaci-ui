import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { breadcrumbs } from "../../styled-system/recipes";

export type BreadcrumbsRootProps = ComponentPropsWithoutRef<"nav">;

/** A landmark navigation region for a hierarchical path. */
export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsRootProps>(
  function BreadcrumbsRoot({ "aria-label": ariaLabel, className, ...props }, ref) {
    const styles = breadcrumbs();

    return (
      <nav
        {...props}
        aria-label={ariaLabel ?? "Breadcrumb"}
        ref={ref}
        className={cx(styles.root, className)}
        data-jaci-component="breadcrumbs"
        data-slot="breadcrumbs"
      />
    );
  },
);

export type BreadcrumbsListProps = ComponentPropsWithoutRef<"ol">;

/** Ordered list containing links, separators, and the current page. */
export const BreadcrumbsList = forwardRef<HTMLOListElement, BreadcrumbsListProps>(
  function BreadcrumbsList({ className, ...props }, ref) {
    return (
      <ol
        {...props}
        ref={ref}
        className={cx(breadcrumbs().list, className)}
        data-slot="breadcrumbs-list"
      />
    );
  },
);

export type BreadcrumbsItemProps = ComponentPropsWithoutRef<"li">;

/** A semantic list item that wraps one breadcrumb destination. */
export const BreadcrumbsItem = forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  function BreadcrumbsItem({ className, ...props }, ref) {
    return (
      <li
        {...props}
        ref={ref}
        className={cx(breadcrumbs().item, className)}
        data-slot="breadcrumbs-item"
      />
    );
  },
);

export type BreadcrumbsLinkProps = ComponentPropsWithoutRef<"a">;

/** A link to an ancestor in the current path. */
export const BreadcrumbsLink = forwardRef<HTMLAnchorElement, BreadcrumbsLinkProps>(
  function BreadcrumbsLink({ className, ...props }, ref) {
    return (
      <a
        {...props}
        ref={ref}
        className={cx(breadcrumbs().link, className)}
        data-slot="breadcrumbs-link"
      />
    );
  },
);

export type BreadcrumbsCurrentProps = ComponentPropsWithoutRef<"span">;

/** The final, non-link breadcrumb that identifies the current page. */
export const BreadcrumbsCurrent = forwardRef<HTMLSpanElement, BreadcrumbsCurrentProps>(
  function BreadcrumbsCurrent({ "aria-current": ariaCurrent, className, ...props }, ref) {
    return (
      <span
        {...props}
        aria-current={ariaCurrent ?? "page"}
        ref={ref}
        className={cx(breadcrumbs().current, className)}
        data-slot="breadcrumbs-current"
      />
    );
  },
);

export type BreadcrumbsSeparatorProps = ComponentPropsWithoutRef<"li">;

/** A decorative separator. It is excluded from the ordered-list semantics. */
export const BreadcrumbsSeparator = forwardRef<HTMLLIElement, BreadcrumbsSeparatorProps>(
  function BreadcrumbsSeparator({ children = "/", className, ...props }, ref) {
    return (
      <li
        {...props}
        aria-hidden="true"
        ref={ref}
        role="presentation"
        className={cx(breadcrumbs().separator, className)}
        data-slot="breadcrumbs-separator"
      >
        {children}
      </li>
    );
  },
);

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Current: BreadcrumbsCurrent,
  Separator: BreadcrumbsSeparator,
};
