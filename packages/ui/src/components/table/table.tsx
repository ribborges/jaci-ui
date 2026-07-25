"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { table } from "../../styled-system/recipes";

export type TableSortDirection = "none" | "ascending" | "descending";
export type TableDensity = "compact" | "comfortable";
export type TableSelectionMode = "none" | "single" | "multiple";
export type TableStatus = "idle" | "loading" | "empty" | "error" | "ready";
export type TableAlignment = "start" | "center" | "end";
export type TableHideBelow = "sm" | "md" | "lg";

export interface TableSortState {
  id: string;
  direction: Exclude<TableSortDirection, "none">;
}

interface TableRowRecord {
  disabled: boolean;
}

interface TableContextValue {
  allSelected: boolean;
  indeterminate: boolean;
  isRowSelected: (id: string) => boolean;
  registerRow: (id: string, row: TableRowRecord) => () => void;
  requestSort: (id: string, direction?: TableSortDirection) => void;
  selectedRowIds: ReadonlySet<string>;
  selectionMode: TableSelectionMode;
  toggleAll: (checked: boolean) => void;
  toggleRow: (id: string, checked: boolean) => void;
  sort: TableSortState | null;
  status: TableStatus;
}

interface TableRowContextValue {
  id: string;
  selectionDisabled: boolean;
}

type TableSection = "head" | "body" | "foot";

const TableContext = createContext<TableContextValue | null>(null);
const TableRowContext = createContext<TableRowContextValue | null>(null);
const TableSectionContext = createContext<TableSection>("body");

function useTableContext() {
  return useContext(TableContext);
}

function useRequiredTableContext() {
  const context = useTableContext();
  if (!context) throw new Error("Table parts must be rendered inside Table.Root.");
  return context;
}

function useTableRowContext() {
  return useContext(TableRowContext);
}

function cycleSortDirection(direction: TableSortDirection): TableSortDirection {
  if (direction === "none") return "ascending";
  if (direction === "ascending") return "descending";
  return "none";
}

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
  defaultSelectedRowIds?: readonly string[];
  defaultSort?: TableSortState | null;
  onSelectionChange?: (rowIds: string[]) => void;
  onSortChange?: (sort: TableSortState | null) => void;
  selectedRowIds?: readonly string[];
  selectionMode?: TableSelectionMode;
  sort?: TableSortState | null;
  status?: TableStatus;
  stickyHeader?: boolean;
  striped?: boolean;
}

export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  {
    bordered = false,
    className,
    defaultSelectedRowIds = [],
    defaultSort = null,
    density = "comfortable",
    onSelectionChange,
    onSortChange,
    selectedRowIds: controlledSelectedRowIds,
    selectionMode = "none",
    sort: controlledSort,
    status = "idle",
    stickyHeader = false,
    striped = false,
    ...props
  },
  ref,
) {
  const [uncontrolledSelectedRowIds, setUncontrolledSelectedRowIds] = useState(
    () => new Set(defaultSelectedRowIds),
  );
  const [uncontrolledSort, setUncontrolledSort] = useState<TableSortState | null>(defaultSort);
  const [rows, setRows] = useState<Map<string, TableRowRecord>>(() => new Map());
  const selectedRowIds = useMemo(
    () => new Set(controlledSelectedRowIds ?? uncontrolledSelectedRowIds),
    [controlledSelectedRowIds, uncontrolledSelectedRowIds],
  );
  const sort = controlledSort === undefined ? uncontrolledSort : controlledSort;
  const selectableRows = useMemo(
    () => [...rows.entries()].filter(([, row]) => !row.disabled).map(([id]) => id),
    [rows],
  );
  const selectedSelectableRows = selectableRows.filter((id) => selectedRowIds.has(id));
  const allSelected =
    selectableRows.length > 0 && selectedSelectableRows.length === selectableRows.length;
  const indeterminate = selectedSelectableRows.length > 0 && !allSelected;
  const styles = table({ bordered, density, stickyHeader, striped });

  const updateSelection = useCallback(
    (next: Set<string>) => {
      const normalized = selectionMode === "single" ? new Set([...next].slice(-1)) : next;
      if (controlledSelectedRowIds === undefined) setUncontrolledSelectedRowIds(normalized);
      onSelectionChange?.([...normalized]);
    },
    [controlledSelectedRowIds, onSelectionChange, selectionMode],
  );
  const toggleRow = useCallback(
    (id: string, checked: boolean) => {
      const row = rows.get(id);
      if (selectionMode === "none" || row?.disabled) return;
      const next = new Set(selectedRowIds);
      if (selectionMode === "single") next.clear();
      if (checked) next.add(id);
      else next.delete(id);
      updateSelection(next);
    },
    [rows, selectedRowIds, selectionMode, updateSelection],
  );
  const toggleAll = useCallback(
    (checked: boolean) => {
      if (selectionMode !== "multiple") return;
      updateSelection(new Set(checked ? selectableRows : []));
    },
    [selectableRows, selectionMode, updateSelection],
  );
  const registerRow = useCallback((id: string, row: TableRowRecord) => {
    setRows((current) => {
      const next = new Map(current);
      next.set(id, row);
      return next;
    });
    return () =>
      setRows((current) => {
        if (!current.has(id)) return current;
        const next = new Map(current);
        next.delete(id);
        return next;
      });
  }, []);
  const requestSort = useCallback(
    (id: string, requestedDirection?: TableSortDirection) => {
      const currentDirection = sort?.id === id ? sort.direction : "none";
      const direction = requestedDirection ?? cycleSortDirection(currentDirection);
      const nextSort = direction === "none" ? null : { id, direction };
      if (controlledSort === undefined) setUncontrolledSort(nextSort);
      onSortChange?.(nextSort);
    },
    [controlledSort, onSortChange, sort],
  );

  const context = useMemo<TableContextValue>(
    () => ({
      allSelected,
      indeterminate,
      isRowSelected: (id) => selectedRowIds.has(id),
      registerRow,
      requestSort,
      selectedRowIds,
      selectionMode,
      status,
      toggleAll,
      toggleRow,
      sort,
    }),
    [
      allSelected,
      indeterminate,
      registerRow,
      requestSort,
      selectedRowIds,
      selectionMode,
      sort,
      status,
      toggleAll,
      toggleRow,
    ],
  );

  return (
    <TableContext.Provider value={context}>
      <table
        {...props}
        ref={ref}
        aria-busy={props["aria-busy"] ?? (status === "loading" || undefined)}
        className={cx(styles.root, className)}
        data-jaci-component="table"
        data-status={status}
        data-slot="table"
      />
    </TableContext.Provider>
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

export type TableDescriptionProps = ComponentPropsWithoutRef<"p">;
export const TableDescription = forwardRef<HTMLParagraphElement, TableDescriptionProps>(
  function TableDescription({ className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        className={cx(table().description, className)}
        data-slot="table-description"
      />
    );
  },
);

export type TableHeaderProps = ComponentPropsWithoutRef<"thead">;
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    return (
      <TableSectionContext.Provider value="head">
        <thead
          {...props}
          ref={ref}
          className={cx(table().header, className)}
          data-slot="table-header"
        />
      </TableSectionContext.Provider>
    );
  },
);

export type TableBodyProps = ComponentPropsWithoutRef<"tbody">;
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...props },
  ref,
) {
  return (
    <TableSectionContext.Provider value="body">
      <tbody {...props} ref={ref} className={cx(table().body, className)} data-slot="table-body" />
    </TableSectionContext.Provider>
  );
});

export type TableFooterProps = ComponentPropsWithoutRef<"tfoot">;
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    return (
      <TableSectionContext.Provider value="foot">
        <tfoot
          {...props}
          ref={ref}
          className={cx(table().footer, className)}
          data-slot="table-footer"
        />
      </TableSectionContext.Provider>
    );
  },
);

export interface TableRowProps extends Omit<ComponentPropsWithoutRef<"tr">, "id"> {
  id: string;
  selectionDisabled?: boolean;
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, id, selectionDisabled = false, selected: selectedOverride, ...props },
  ref,
) {
  const context = useTableContext();
  const section = useContext(TableSectionContext);
  const selected = selectedOverride ?? context?.isRowSelected(id) ?? false;
  useEffect(
    () =>
      section === "head" ? undefined : context?.registerRow(id, { disabled: selectionDisabled }),
    [context?.registerRow, id, section, selectionDisabled],
  );

  return (
    <TableRowContext.Provider value={{ id, selectionDisabled }}>
      <tr
        {...props}
        id={id}
        ref={ref}
        aria-selected={selected || undefined}
        className={cx(table().row, className)}
        data-selected={selected || undefined}
        data-selection-disabled={selectionDisabled || undefined}
        data-slot="table-row"
      />
    </TableRowContext.Provider>
  );
});

export interface TableHeadProps extends Omit<ComponentPropsWithoutRef<"th">, "align"> {
  align?: TableAlignment;
  hideBelow?: TableHideBelow;
  onSort?: (direction: TableSortDirection) => void;
  sortDirection?: TableSortDirection;
  sortable?: boolean;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  {
    align = "start",
    children,
    className,
    hideBelow,
    onSort,
    sortDirection,
    sortable = false,
    ...props
  },
  ref,
) {
  const context = useTableContext();
  const styles = table({ align, hideBelow });
  const resolvedDirection =
    sortDirection ??
    (sortable && props.id && context?.sort?.id === props.id ? context.sort.direction : "none");
  const sort = () => {
    const next = cycleSortDirection(resolvedDirection);
    if (props.id) context?.requestSort(props.id, next);
    onSort?.(next);
  };

  return (
    <th
      {...props}
      ref={ref}
      aria-sort={sortable ? resolvedDirection : undefined}
      className={cx(styles.head, className)}
      data-align={align}
      data-hide-below={hideBelow}
      data-sort-direction={sortable ? resolvedDirection : undefined}
      data-slot="table-head"
      scope={props.scope ?? "col"}
    >
      {sortable ? (
        <button
          aria-label={
            props["aria-label"] ?? `Sort by ${typeof children === "string" ? children : "column"}`
          }
          className={styles.sortButton}
          onClick={sort}
          type="button"
        >
          <span>{children}</span>
          <span aria-hidden="true">
            {resolvedDirection === "ascending"
              ? "↑"
              : resolvedDirection === "descending"
                ? "↓"
                : "↕"}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<ComponentPropsWithoutRef<"td">, "align"> {
  align?: TableAlignment;
  hideBelow?: TableHideBelow;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = "start", className, hideBelow, ...props },
  ref,
) {
  const styles = table({ align, hideBelow });
  return (
    <td
      {...props}
      ref={ref}
      className={cx(styles.cell, className)}
      data-align={align}
      data-hide-below={hideBelow}
      data-slot="table-cell"
    />
  );
});

interface TableSelectionInputProps {
  "aria-label"?: string | undefined;
  checked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  inputProps?: Omit<
    ComponentPropsWithoutRef<"input">,
    "checked" | "defaultChecked" | "onChange" | "type"
  >;
  onCheckedChange?: (checked: boolean) => void;
}

function SelectionInput({
  "aria-label": ariaLabel,
  checked = false,
  indeterminate = false,
  inputProps,
  onCheckedChange,
}: TableSelectionInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
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
    {
      checked: checkedOverride,
      className,
      indeterminate: indeterminateOverride,
      inputProps,
      onCheckedChange,
      ...props
    },
    ref,
  ) {
    const context = useRequiredTableContext();
    const ariaLabel = props["aria-label"] ?? inputProps?.["aria-label"] ?? "Select all rows";
    const checked = checkedOverride ?? context.allSelected;
    const indeterminate = indeterminateOverride ?? context.indeterminate;
    const disabled = Boolean(
      inputProps?.disabled ||
        (context.selectionMode !== "multiple" && !onCheckedChange && checkedOverride === undefined),
    );
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
          indeterminate={indeterminate}
          inputProps={{ ...inputProps, disabled }}
          onCheckedChange={onCheckedChange ?? context.toggleAll}
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
    {
      checked: checkedOverride,
      className,
      indeterminate = false,
      inputProps,
      onCheckedChange,
      ...props
    },
    ref,
  ) {
    const context = useRequiredTableContext();
    const row = useTableRowContext();
    const id = row?.id ?? "";
    const ariaLabel = props["aria-label"] ?? inputProps?.["aria-label"] ?? "Select row";
    const checked = checkedOverride ?? context.isRowSelected(id);
    const disabled = Boolean(
      inputProps?.disabled ||
        row?.selectionDisabled ||
        (context.selectionMode === "none" && !onCheckedChange && checkedOverride === undefined),
    );
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
          indeterminate={indeterminate}
          inputProps={{ ...inputProps, disabled }}
          onCheckedChange={onCheckedChange ?? ((next) => context.toggleRow(id, next))}
        />
      </td>
    );
  },
);

export interface TableStateProps extends Omit<ComponentPropsWithoutRef<"tr">, "children"> {
  children?: ReactNode;
  colSpan?: number;
}

const TableStateRow = forwardRef<
  HTMLTableRowElement,
  TableStateProps & { live?: "polite" | "assertive" }
>(function TableStateRow({ children, className, colSpan = 1, live = "polite", ...props }, ref) {
  const name = live === "assertive" ? "error" : "loading";
  return (
    <tr {...props} ref={ref} className={cx(table().row, className)} data-slot={`table-${name}-row`}>
      <td aria-live={live} className={table().empty} colSpan={colSpan} data-slot={`table-${name}`}>
        {children}
      </td>
    </tr>
  );
});

export interface TableEmptyProps extends TableStateProps {}
export type TableLoadingProps = TableStateProps;
export type TableErrorProps = TableStateProps;
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

export const TableLoading = forwardRef<HTMLTableRowElement, TableStateProps>(function TableLoading(
  { children = "Loading…", ...props },
  ref,
) {
  return (
    <TableStateRow {...props} ref={ref} live="polite">
      {children}
    </TableStateRow>
  );
});

export const TableError = forwardRef<HTMLTableRowElement, TableStateProps>(function TableError(
  { children = "Something went wrong.", ...props },
  ref,
) {
  return (
    <TableStateRow {...props} ref={ref} live="assertive">
      {children}
    </TableStateRow>
  );
});

export const Table = {
  Container: TableContainer,
  Root: TableRoot,
  Caption: TableCaption,
  Description: TableDescription,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  SelectionHeader: TableSelectionHeader,
  SelectionCell: TableSelectionCell,
  Empty: TableEmpty,
  Loading: TableLoading,
  Error: TableError,
};
