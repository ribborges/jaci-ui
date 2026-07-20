"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { table } from "../../styled-system/recipes";

export type TableSortDirection = "none" | "ascending" | "descending";
export type TableDensity = "compact" | "comfortable";

export interface TableContainerProps extends ComponentPropsWithoutRef<"div"> {}

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(table().container, className)}
        data-jaci-component="table"
        data-slot="table-container"
      />
    );
  },
);

export interface TableRootProps extends ComponentPropsWithoutRef<"table"> {
  bordered?: boolean;
  density?: TableDensity;
  stickyHeader?: boolean;
  striped?: boolean;
}

export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  {
    bordered = false,
    className,
    density = "comfortable",
    stickyHeader = false,
    striped = false,
    ...props
  },
  ref,
) {
  const styles = table({ bordered, density, stickyHeader, striped });

  return (
    <table
      {...props}
      ref={ref}
      className={cx(styles.root, className)}
      data-jaci-component="table"
      data-slot="table"
    />
  );
});

export type TableCaptionProps = ComponentPropsWithoutRef<"caption">;

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, ...props }, ref) {
    return (
      <caption
        {...props}
        ref={ref}
        className={cx(table().caption, className)}
        data-slot="table-caption"
      />
    );
  },
);

export type TableHeaderProps = ComponentPropsWithoutRef<"thead">;
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <thead
        {...props}
        ref={ref}
        className={cx(table().header, className)}
        data-slot="table-header"
      />
    );
  },
);

export type TableBodyProps = ComponentPropsWithoutRef<"tbody">;
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return (
    <tbody {...props} ref={ref} className={cx(table().body, className)} data-slot="table-body" />
  );
});

export type TableFooterProps = ComponentPropsWithoutRef<"tfoot">;
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <tfoot
        {...props}
        ref={ref}
        className={cx(table().footer, className)}
        data-slot="table-footer"
      />
    );
  },
);

export interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, selected = false, ...props },
  ref,
) {
  return (
    <tr
      {...props}
      ref={ref}
      aria-selected={selected || undefined}
      className={cx(table().row, className)}
      data-selected={selected || undefined}
      data-slot="table-row"
    />
  );
});

export interface TableHeadProps extends ComponentPropsWithoutRef<"th"> {
  onSort?: () => void;
  sortDirection?: TableSortDirection;
  sortable?: boolean;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { children, className, onSort, sortDirection = "none", sortable = false, ...props },
  ref,
) {
  const styles = table();
  const ariaSort = sortable ? sortDirection : undefined;

  return (
    <th
      {...props}
      ref={ref}
      aria-sort={ariaSort}
      className={cx(styles.head, className)}
      data-sort-direction={sortable ? sortDirection : undefined}
      data-slot="table-head"
      scope={props.scope ?? "col"}
    >
      {sortable ? (
        <button
          aria-label={
            props["aria-label"] ?? `Sort by ${typeof children === "string" ? children : "column"}`
          }
          className={styles.sortButton}
          onClick={onSort}
          type="button"
        >
          <span>{children}</span>
          <span aria-hidden="true">
            {sortDirection === "ascending" ? "↑" : sortDirection === "descending" ? "↓" : "↕"}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends ComponentPropsWithoutRef<"td"> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return <td {...props} ref={ref} className={cx(table().cell, className)} data-slot="table-cell" />;
});

interface TableSelectionInputProps {
  "aria-label"?: string | undefined;
  checked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  inputProps?:
    | Omit<ComponentPropsWithoutRef<"input">, "checked" | "defaultChecked" | "onChange" | "type">
    | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}

function SelectionInput({
  "aria-label": ariaLabel,
  checked,
  indeterminate = false,
  inputProps,
  onCheckedChange,
}: TableSelectionInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      {...inputProps}
      ref={ref}
      aria-label={ariaLabel ?? inputProps?.["aria-label"]}
      aria-checked={indeterminate ? "mixed" : checked}
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.currentTarget.checked)}
      type="checkbox"
    />
  );
}

export interface TableSelectionHeaderProps
  extends Omit<ComponentPropsWithoutRef<"th">, "children">,
    TableSelectionInputProps {}

export const TableSelectionHeader = forwardRef<HTMLTableCellElement, TableSelectionHeaderProps>(
  function TableSelectionHeader(
    { checked, className, indeterminate, inputProps, onCheckedChange, ...props },
    ref,
  ) {
    const ariaLabel = props["aria-label"] ?? inputProps?.["aria-label"] ?? "Select all rows";

    return (
      <th
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={cx(table().selection, className)}
        data-slot="table-selection-header"
        scope="col"
      >
        <SelectionInput
          aria-label={ariaLabel}
          checked={checked}
          inputProps={inputProps}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
        />
      </th>
    );
  },
);

export interface TableSelectionCellProps
  extends Omit<ComponentPropsWithoutRef<"td">, "children">,
    TableSelectionInputProps {}

export const TableSelectionCell = forwardRef<HTMLTableCellElement, TableSelectionCellProps>(
  function TableSelectionCell(
    { checked, className, indeterminate, inputProps, onCheckedChange, ...props },
    ref,
  ) {
    const ariaLabel = props["aria-label"] ?? inputProps?.["aria-label"] ?? "Select row";

    return (
      <td
        {...props}
        ref={ref}
        className={cx(table().selection, className)}
        data-slot="table-selection-cell"
      >
        <SelectionInput
          aria-label={ariaLabel}
          checked={checked}
          inputProps={inputProps}
          indeterminate={indeterminate}
          onCheckedChange={onCheckedChange}
        />
      </td>
    );
  },
);

export interface TableEmptyProps extends Omit<ComponentPropsWithoutRef<"tr">, "children"> {
  children?: ReactNode;
  colSpan?: number;
}

export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(function TableEmpty(
  { children = "No results found.", className, colSpan = 1, ...props },
  ref,
) {
  return (
    <tr {...props} ref={ref} className={cx(table().row, className)} data-slot="table-empty-row">
      <td className={table().empty} colSpan={colSpan} data-slot="table-empty">
        {children}
      </td>
    </tr>
  );
});

export const Table = {
  Container: TableContainer,
  Root: TableRoot,
  Caption: TableCaption,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  SelectionHeader: TableSelectionHeader,
  SelectionCell: TableSelectionCell,
  Empty: TableEmpty,
};
