"use client";

import { createContext, forwardRef, useCallback, useContext, useMemo, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { pagination } from "../../styled-system/recipes";

export type PaginationDensity = "compact" | "comfortable";

interface PaginationContextValue {
  density: PaginationDensity;
  goTo: (page: number) => void;
  page: number | undefined;
  pageCount: number | undefined;
}

const PaginationContext = createContext<PaginationContextValue | null>(null);

function usePaginationContext() {
  return useContext(PaginationContext);
}

export interface PaginationRootProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  children?: ReactNode;
  defaultPage?: number;
  density?: PaginationDensity;
  onPageChange?: (page: number) => void;
  page?: number;
  pageCount?: number;
  showFirstLast?: boolean;
  siblingCount?: number;
}

export const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
  {
    children,
    "aria-label": ariaLabel,
    className,
    defaultPage = 1,
    density = "comfortable",
    onPageChange,
    page: controlledPage,
    pageCount,
    showFirstLast = false,
    siblingCount = 1,
    ...props
  },
  ref,
) {
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const page = pageCount
    ? Math.min(Math.max(controlledPage ?? uncontrolledPage, 1), pageCount)
    : controlledPage;
  const goTo = useCallback(
    (nextPage: number) => {
      if (!pageCount) return;
      const next = Math.min(Math.max(nextPage, 1), pageCount);
      if (controlledPage === undefined) setUncontrolledPage(next);
      onPageChange?.(next);
    },
    [controlledPage, onPageChange, pageCount],
  );
  const context = useMemo(
    () => ({ density, goTo, page, pageCount }),
    [density, goTo, page, pageCount],
  );

  return (
    <PaginationContext.Provider value={context}>
      <nav
        {...props}
        aria-label={ariaLabel ?? "Pagination"}
        ref={ref}
        className={cx(pagination({ density }).root, className)}
        data-density={density}
        data-jaci-component="pagination"
        data-slot="pagination"
      >
        {children ??
          (pageCount ? (
            <PaginationGenerated
              page={page ?? 1}
              pageCount={pageCount}
              showFirstLast={showFirstLast}
              siblingCount={siblingCount}
            />
          ) : null)}
      </nav>
    </PaginationContext.Provider>
  );
});

export type PaginationListProps = ComponentPropsWithoutRef<"ul">;
export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ className, ...props }, ref) {
    const context = usePaginationContext();
    return (
      <ul
        {...props}
        ref={ref}
        className={cx(pagination({ density: context?.density }).list, className)}
        data-slot="pagination-list"
      />
    );
  },
);

export type PaginationItemProps = ComponentPropsWithoutRef<"li">;
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
  active?: boolean;
  disabled?: boolean;
  page?: number | undefined;
}

type PaginationAnchorSlot =
  | "pagination-link"
  | "pagination-first"
  | "pagination-last"
  | "pagination-previous"
  | "pagination-next";

interface PaginationAnchorProps extends PaginationLinkProps {
  slot: PaginationAnchorSlot;
}

function getAnchorClassName(
  active: boolean,
  disabled: boolean,
  density: PaginationDensity | undefined,
  slot: PaginationAnchorSlot,
) {
  const styles = pagination({ active, density, disabled });
  if (slot === "pagination-previous") return cx(styles.link, styles.previous);
  if (slot === "pagination-next") return cx(styles.link, styles.next);
  if (slot === "pagination-first") return cx(styles.link, styles.first);
  if (slot === "pagination-last") return cx(styles.link, styles.last);
  return styles.link;
}

const PaginationAnchor = forwardRef<HTMLAnchorElement, PaginationAnchorProps>(
  function PaginationAnchor(
    {
      active: activeProp,
      "aria-current": ariaCurrent,
      className,
      disabled: disabledProp = false,
      href,
      onClick,
      page,
      slot,
      tabIndex,
      ...props
    },
    ref,
  ) {
    const context = usePaginationContext();
    const active = activeProp ?? (page !== undefined && context?.page === page);
    const disabled = Boolean(disabledProp || (page !== undefined && context?.pageCount === 1));
    return (
      <a
        {...props}
        aria-current={ariaCurrent ?? (active ? "page" : undefined)}
        aria-disabled={disabled || undefined}
        ref={ref}
        className={cx(
          getAnchorClassName(Boolean(active), disabled, context?.density, slot),
          className,
        )}
        data-active={active || undefined}
        data-disabled={disabled || undefined}
        data-page={page}
        data-slot={slot}
        href={disabled ? undefined : href}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          if (page !== undefined && context?.pageCount) {
            event.preventDefault();
            context.goTo(page);
          }
          onClick?.(event);
        }}
        tabIndex={disabled ? -1 : tabIndex}
      />
    );
  },
);

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink(props, ref) {
    return <PaginationAnchor {...props} ref={ref} slot="pagination-link" />;
  },
);

export interface PaginationPreviousProps extends PaginationLinkProps {
  children?: ReactNode;
}
export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  function PaginationPrevious({ "aria-label": ariaLabel, children, page, rel, ...props }, ref) {
    const context = usePaginationContext();
    const targetPage = page ?? (context?.page ? context.page - 1 : undefined);
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to previous page"}
        disabled={props.disabled ?? (targetPage !== undefined && targetPage < 1)}
        page={targetPage}
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
export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationNextProps>(
  function PaginationNext({ "aria-label": ariaLabel, children, page, rel, ...props }, ref) {
    const context = usePaginationContext();
    const targetPage = page ?? (context?.page ? context.page + 1 : undefined);
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to next page"}
        disabled={
          props.disabled ??
          (targetPage !== undefined && targetPage > (context?.pageCount ?? Infinity))
        }
        page={targetPage}
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

export interface PaginationFirstProps extends PaginationLinkProps {
  children?: ReactNode;
}
export const PaginationFirst = forwardRef<HTMLAnchorElement, PaginationFirstProps>(
  function PaginationFirst({ "aria-label": ariaLabel, children, page, ...props }, ref) {
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to first page"}
        page={page ?? 1}
        ref={ref}
        slot="pagination-first"
      >
        {children ?? "First"}
      </PaginationAnchor>
    );
  },
);

export interface PaginationLastProps extends PaginationLinkProps {
  children?: ReactNode;
}
export const PaginationLast = forwardRef<HTMLAnchorElement, PaginationLastProps>(
  function PaginationLast({ "aria-label": ariaLabel, children, page, ...props }, ref) {
    const context = usePaginationContext();
    return (
      <PaginationAnchor
        {...props}
        aria-label={ariaLabel ?? "Go to last page"}
        page={page ?? context?.pageCount}
        ref={ref}
        slot="pagination-last"
      >
        {children ?? "Last"}
      </PaginationAnchor>
    );
  },
);

export type PaginationEllipsisProps = ComponentPropsWithoutRef<"span">;
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

type PaginationPageItem = number | "ellipsis";

function getPageItems(page: number, pageCount: number, siblingCount: number): PaginationPageItem[] {
  const visible = new Set<number>([1, pageCount]);
  for (let index = page - siblingCount; index <= page + siblingCount; index += 1) {
    if (index > 0 && index <= pageCount) visible.add(index);
  }
  const pages = [...visible].sort((left, right) => left - right);
  const items: PaginationPageItem[] = [];
  pages.forEach((value, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined && value - previous > 1) items.push("ellipsis");
    items.push(value);
  });
  return items;
}

function PaginationGenerated({
  page,
  pageCount,
  showFirstLast,
  siblingCount,
}: {
  page: number;
  pageCount: number;
  showFirstLast: boolean;
  siblingCount: number;
}) {
  const pageItems = getPageItems(page, pageCount, siblingCount);
  return (
    <PaginationList>
      {showFirstLast ? (
        <PaginationItem>
          <PaginationFirst disabled={page <= 1} />
        </PaginationItem>
      ) : null}
      <PaginationItem>
        <PaginationPrevious disabled={page <= 1} />
      </PaginationItem>
      {pageItems.map((item, index) =>
        item === "ellipsis" ? (
          <PaginationItem
            key={`ellipsis-${pageItems.slice(0, index).filter((value) => value === "ellipsis").length + 1}`}
          >
            <PaginationEllipsis />
          </PaginationItem>
        ) : (
          <PaginationItem key={item}>
            <PaginationLink page={item}>{item}</PaginationLink>
          </PaginationItem>
        ),
      )}
      <PaginationItem>
        <PaginationNext disabled={page >= pageCount} />
      </PaginationItem>
      {showFirstLast ? (
        <PaginationItem>
          <PaginationLast disabled={page >= pageCount} />
        </PaginationItem>
      ) : null}
    </PaginationList>
  );
}

export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Link: PaginationLink,
  First: PaginationFirst,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Last: PaginationLast,
  Ellipsis: PaginationEllipsis,
};
