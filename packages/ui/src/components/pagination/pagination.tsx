import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { pagination } from "../../styled-system/recipes";

export type PaginationRootProps = ComponentPropsWithoutRef<"nav">;

/** A navigation landmark for moving between pages of a result set. */
export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
  { "aria-label": ariaLabel, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel ?? "Pagination"}
      ref={ref}
      className={cx(pagination().root, className)}
      data-jaci-component="pagination"
      data-slot="pagination"
    />
  );
});

export type PaginationListProps = ComponentPropsWithoutRef<"ul">;

/** An unordered list of page controls. */
export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ className, ...props }, ref) {
    return (
      <ul
        {...props}
        ref={ref}
        className={cx(pagination().list, className)}
        data-slot="pagination-list"
      />
    );
  },
);

export type PaginationItemProps = ComponentPropsWithoutRef<"li">;

/** A list item that wraps a page link, direction control, or ellipsis. */
export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ className, ...props }, ref) {
    return (
      <li
        {...props}
        ref={ref}
        className={cx(pagination().item, className)}
        data-slot="pagination-item"
      />
    );
  },
);

export interface PaginationLinkProps extends ComponentPropsWithoutRef<"a"> {
  /** Marks the link as the current page. */
  active?: boolean;
  /** Presents a non-navigable control when no destination is available. */
  disabled?: boolean;
}

type PaginationAnchorSlot = "pagination-link" | "pagination-previous" | "pagination-next";

interface PaginationAnchorProps extends PaginationLinkProps {
  children?: ReactNode;
  slot: PaginationAnchorSlot;
}

function getAnchorClassName(active: boolean, disabled: boolean, slot: PaginationAnchorSlot) {
  const styles = pagination({ active, disabled });

  if (slot === "pagination-previous") {
    return cx(styles.link, styles.previous);
  }

  if (slot === "pagination-next") {
    return cx(styles.link, styles.next);
  }

  return styles.link;
}

const PaginationAnchor = forwardRef<HTMLAnchorElement, PaginationAnchorProps>(
  function PaginationAnchor(
    {
      active = false,
      "aria-current": ariaCurrent,
      className,
      disabled = false,
      href,
      onClick,
      slot,
      tabIndex,
      ...props
    },
    ref,
  ) {
    return (
      <a
        {...props}
        aria-current={ariaCurrent ?? (active ? "page" : undefined)}
        aria-disabled={disabled || undefined}
        ref={ref}
        className={cx(getAnchorClassName(active, disabled, slot), className)}
        data-active={active || undefined}
        data-disabled={disabled || undefined}
        data-slot={slot}
        href={disabled ? undefined : href}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          onClick?.(event);
        }}
        tabIndex={disabled ? -1 : tabIndex}
      />
    );
  },
);

/** A link to a numbered page. Set `active` on the current destination. */
export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink(props, ref) {
    return <PaginationAnchor {...props} ref={ref} slot="pagination-link" />;
  },
);

export interface PaginationPreviousProps extends PaginationLinkProps {
  children?: ReactNode;
}

/** A directional link to the preceding page. */
export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  function PaginationPrevious({ "aria-label": ariaLabel, children, rel, ...props }, ref) {
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to previous page"}
        ref={ref}
        rel={rel ?? "prev"}
        slot="pagination-previous"
      >
        {children ?? (
          <>
            <span aria-hidden="true">‹</span>
            <span>Previous</span>
          </>
        )}
      </PaginationAnchor>
    );
  },
);

export interface PaginationNextProps extends PaginationLinkProps {
  children?: ReactNode;
}

/** A directional link to the following page. */
export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationNextProps>(
  function PaginationNext({ "aria-label": ariaLabel, children, rel, ...props }, ref) {
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to next page"}
        ref={ref}
        rel={rel ?? "next"}
        slot="pagination-next"
      >
        {children ?? (
          <>
            <span>Next</span>
            <span aria-hidden="true">›</span>
          </>
        )}
      </PaginationAnchor>
    );
  },
);

export type PaginationEllipsisProps = ComponentPropsWithoutRef<"span">;

/** A non-interactive marker for omitted page ranges. */
export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ children = "…", className, ...props }, ref) {
    return (
      <span
        {...props}
        aria-hidden="true"
        ref={ref}
        className={cx(pagination().ellipsis, className)}
        data-slot="pagination-ellipsis"
      >
        {children}
      </span>
    );
  },
);

export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
};
