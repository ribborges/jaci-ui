"use client";

import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { toolbar } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import type { ToggleSize, ToggleVariant } from "../toggle";

export type ToolbarOrientation = "horizontal" | "vertical";

export interface ToolbarRootProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Root> {
  orientation?: ToolbarOrientation;
}

export const ToolbarRoot = forwardRef<HTMLDivElement, ToolbarRootProps>(function ToolbarRoot(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  const styles = toolbar();

  return (
    <BaseToolbar.Root
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.root, className)}
      data-jaci-component="toolbar"
      data-orientation={orientation}
      data-slot="toolbar"
      orientation={orientation}
    />
  );
});

export type ToolbarGroupProps = ComponentPropsWithoutRef<typeof BaseToolbar.Group>;

export const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Group
      {...props}
      ref={ref}
      className={withRecipeClassName(toolbar().group, className)}
      data-jaci-component="toolbar"
      data-slot="toolbar-group"
    />
  );
});

export interface ToolbarButtonProps extends ComponentPropsWithoutRef<typeof BaseToolbar.Button> {
  size?: ToggleSize;
  variant?: ToggleVariant;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton({ className, size = "md", variant = "ghost", ...props }, ref) {
    return (
      <BaseToolbar.Button
        {...props}
        ref={ref}
        className={withRecipeClassName(toolbar({ size, variant }).button, className)}
        data-jaci-component="toolbar"
        data-slot="toolbar-button"
      />
    );
  },
);

export type ToolbarLinkProps = ComponentPropsWithoutRef<typeof BaseToolbar.Link>;

export const ToolbarLink = forwardRef<HTMLAnchorElement, ToolbarLinkProps>(function ToolbarLink(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Link
      {...props}
      ref={ref}
      className={withRecipeClassName(toolbar().link, className)}
      data-jaci-component="toolbar"
      data-slot="toolbar-link"
    />
  );
});

export type ToolbarInputProps = ComponentPropsWithoutRef<typeof BaseToolbar.Input>;

export const ToolbarInput = forwardRef<HTMLInputElement, ToolbarInputProps>(function ToolbarInput(
  { className, ...props },
  ref,
) {
  return (
    <BaseToolbar.Input
      {...props}
      ref={ref}
      className={withRecipeClassName(toolbar().input, className)}
      data-jaci-component="toolbar"
      data-slot="toolbar-input"
    />
  );
});

export type ToolbarSeparatorProps = ComponentPropsWithoutRef<typeof BaseToolbar.Separator>;

export const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  function ToolbarSeparator({ className, ...props }, ref) {
    return (
      <BaseToolbar.Separator
        {...props}
        ref={ref}
        className={withRecipeClassName(toolbar().separator, className)}
        data-jaci-component="toolbar"
        data-slot="toolbar-separator"
      />
    );
  },
);

export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Input: ToolbarInput,
  Separator: ToolbarSeparator,
};
