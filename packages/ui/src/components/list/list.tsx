import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { list } from "../../styled-system/recipes";

export type ListVariant = "plain" | "divided" | "card";
export type ListGap = "none" | "sm" | "md" | "lg";

export interface ListRootProps extends Omit<ComponentPropsWithoutRef<"ul">, "children"> {
  children?: ReactNode;
  gap?: ListGap;
  ordered?: boolean;
  variant?: ListVariant;
}

export const ListRoot = forwardRef<HTMLElement, ListRootProps>(function ListRoot(
  { children, className, gap = "md", ordered = false, variant = "plain", ...props },
  ref,
) {
  const styles = list({ gap, variant });
  const Component = ordered ? "ol" : "ul";

  return (
    <Component
      {...props}
      ref={ref as never}
      className={cx(styles.root, className)}
      data-gap={gap}
      data-jaci-component="list"
      data-ordered={ordered || undefined}
      data-slot="list"
      data-variant={variant}
    >
      {children}
    </Component>
  );
});

export interface ListItemProps extends Omit<ComponentPropsWithoutRef<"li">, "children"> {
  children?: ReactNode;
  disabled?: boolean;
  interactive?: boolean;
  selected?: boolean;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { children, className, disabled = false, interactive = false, selected = false, ...props },
  ref,
) {
  const styles = list();

  return (
    <li
      {...props}
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cx(styles.item, className)}
      data-disabled={disabled || undefined}
      data-interactive={interactive || undefined}
      data-selected={selected || undefined}
      data-slot="list-item"
    >
      {children}
    </li>
  );
});

export type ListItemContentProps = ComponentPropsWithoutRef<"div">;
export const ListItemContent = forwardRef<HTMLDivElement, ListItemContentProps>(
  function ListItemContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(list().content, className)}
        data-slot="list-item-content"
      />
    );
  },
);

export type ListItemTitleProps = ComponentPropsWithoutRef<"span">;
export const ListItemTitle = forwardRef<HTMLSpanElement, ListItemTitleProps>(function ListItemTitle(
  { className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx(list().title, className)}
      data-slot="list-item-title"
    />
  );
});

export type ListItemDescriptionProps = ComponentPropsWithoutRef<"span">;
export const ListItemDescription = forwardRef<HTMLSpanElement, ListItemDescriptionProps>(
  function ListItemDescription({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cx(list().description, className)}
        data-slot="list-item-description"
      />
    );
  },
);

export type ListItemActionProps = ComponentPropsWithoutRef<"div">;
export const ListItemAction = forwardRef<HTMLDivElement, ListItemActionProps>(
  function ListItemAction({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(list().action, className)}
        data-slot="list-item-action"
      />
    );
  },
);

export const List = {
  Root: ListRoot,
  Item: ListItem,
  ItemContent: ListItemContent,
  ItemTitle: ListItemTitle,
  ItemDescription: ListItemDescription,
  ItemAction: ListItemAction,
};
