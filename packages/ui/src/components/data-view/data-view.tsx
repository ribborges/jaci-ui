import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { dataView } from "../../styled-system/recipes";

export type DataViewLayout = "table" | "list" | "grid";
export type DataViewColumns = 1 | 2 | 3 | 4;

export interface DataViewRootProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  children?: ReactNode;
  columns?: DataViewColumns;
  layout?: DataViewLayout;
}

export const DataViewRoot = forwardRef<HTMLElement, DataViewRootProps>(function DataViewRoot(
  { children, className, columns = 3, layout = "list", ...props },
  ref,
) {
  const styles = dataView({ columns: String(columns) as "1" | "2" | "3" | "4", layout });

  return (
    <section
      {...props}
      ref={ref}
      className={cx(styles.root, className)}
      data-columns={columns}
      data-jaci-component="data-view"
      data-layout={layout}
      data-slot="data-view"
    >
      {children}
    </section>
  );
});

export type DataViewToolbarProps = ComponentPropsWithoutRef<"div">;
export const DataViewToolbar = forwardRef<HTMLDivElement, DataViewToolbarProps>(
  function DataViewToolbar({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dataView().toolbar, className)}
        data-slot="data-view-toolbar"
      />
    );
  },
);

export type DataViewContentProps = ComponentPropsWithoutRef<"div">;
export const DataViewContent = forwardRef<HTMLDivElement, DataViewContentProps>(
  function DataViewContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(dataView().content, className)}
        data-slot="data-view-content"
      />
    );
  },
);

export interface DataViewStateProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export const DataViewLoading = forwardRef<HTMLDivElement, DataViewStateProps>(
  function DataViewLoading({ children = "Loading…", className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        aria-live="polite"
        className={cx(dataView().loading, className)}
        data-slot="data-view-loading"
      >
        {children}
      </div>
    );
  },
);

export const DataViewEmpty = forwardRef<HTMLDivElement, DataViewStateProps>(function DataViewEmpty(
  { children = "No results found.", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(dataView().empty, className)}
      data-slot="data-view-empty"
    >
      {children}
    </div>
  );
});

export const DataViewError = forwardRef<HTMLDivElement, DataViewStateProps>(function DataViewError(
  { children = "Something went wrong.", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      aria-live="assertive"
      className={cx(dataView().error, className)}
      data-slot="data-view-error"
      role="alert"
    >
      {children}
    </div>
  );
});

// biome-ignore lint/suspicious/noShadowRestrictedNames: DataView is the public component API name.
export const DataView = {
  Root: DataViewRoot,
  Toolbar: DataViewToolbar,
  Content: DataViewContent,
  Loading: DataViewLoading,
  Empty: DataViewEmpty,
  Error: DataViewError,
};
