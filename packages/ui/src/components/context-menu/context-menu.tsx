"use client";

import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { ContextMenuRoot as BaseContextMenuRoot } from "@base-ui/react/context-menu";

import { menu } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

/**
 * A right-click and long-press menu with Base UI's keyboard navigation,
 * focus management, submenu support, and ARIA semantics.
 */
export type ContextMenuRootProps = BaseContextMenuRoot.Props;

export function ContextMenuRoot(props: ContextMenuRootProps) {
  return <BaseContextMenu.Root {...props} />;
}

export type ContextMenuTriggerProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Trigger>;

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Trigger
        {...props}
        ref={ref}
        className={className}
        data-jaci-component="context-menu"
        data-slot="context-menu-trigger"
      />
    );
  },
);

export type ContextMenuPortalProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Portal>;
export const ContextMenuPortal: typeof BaseContextMenu.Portal = BaseContextMenu.Portal;

export type ContextMenuBackdropProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Backdrop>;
export const ContextMenuBackdrop: typeof BaseContextMenu.Backdrop = BaseContextMenu.Backdrop;

export type ContextMenuPositionerProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.Positioner
>;

export const ContextMenuPositioner = forwardRef<HTMLDivElement, ContextMenuPositionerProps>(
  function ContextMenuPositioner({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().positioner, className)}
        data-slot="context-menu-positioner"
      />
    );
  },
);

export type ContextMenuPopupProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Popup>;

export const ContextMenuPopup = forwardRef<HTMLDivElement, ContextMenuPopupProps>(
  function ContextMenuPopup({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Popup
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().popup, className)}
        data-slot="context-menu-popup"
      />
    );
  },
);

export type ContextMenuArrowProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Arrow>;

export const ContextMenuArrow = forwardRef<HTMLDivElement, ContextMenuArrowProps>(
  function ContextMenuArrow({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Arrow
        {...props}
        ref={ref}
        className={className}
        data-slot="context-menu-arrow"
      />
    );
  },
);

export type ContextMenuItemProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Item>;

export const ContextMenuItem = forwardRef<HTMLElement, ContextMenuItemProps>(
  function ContextMenuItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Item
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="context-menu-item"
      />
    );
  },
);

export type ContextMenuLinkItemProps = ComponentPropsWithoutRef<typeof BaseContextMenu.LinkItem>;

export const ContextMenuLinkItem = forwardRef<Element, ContextMenuLinkItemProps>(
  function ContextMenuLinkItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.LinkItem
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="context-menu-link-item"
      />
    );
  },
);

export type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.CheckboxItem
>;

export const ContextMenuCheckboxItem = forwardRef<HTMLElement, ContextMenuCheckboxItemProps>(
  function ContextMenuCheckboxItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.CheckboxItem
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="context-menu-checkbox-item"
      />
    );
  },
);

export type ContextMenuCheckboxItemIndicatorProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.CheckboxItemIndicator
>;

export const ContextMenuCheckboxItemIndicator = forwardRef<
  HTMLSpanElement,
  ContextMenuCheckboxItemIndicatorProps
>(function ContextMenuCheckboxItemIndicator({ children = "✓", className, ...props }, ref) {
  return (
    <BaseContextMenu.CheckboxItemIndicator
      {...props}
      ref={ref}
      className={className}
      data-slot="context-menu-checkbox-indicator"
      aria-hidden="true"
    >
      {children}
    </BaseContextMenu.CheckboxItemIndicator>
  );
});

export type ContextMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.RadioGroup
>;
export const ContextMenuRadioGroup: typeof BaseContextMenu.RadioGroup = BaseContextMenu.RadioGroup;

export type ContextMenuRadioItemProps = ComponentPropsWithoutRef<typeof BaseContextMenu.RadioItem>;

export const ContextMenuRadioItem = forwardRef<HTMLElement, ContextMenuRadioItemProps>(
  function ContextMenuRadioItem({ className, ...props }, ref) {
    return (
      <BaseContextMenu.RadioItem
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="context-menu-radio-item"
      />
    );
  },
);

export type ContextMenuRadioItemIndicatorProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.RadioItemIndicator
>;

export const ContextMenuRadioItemIndicator = forwardRef<
  HTMLSpanElement,
  ContextMenuRadioItemIndicatorProps
>(function ContextMenuRadioItemIndicator({ children = "•", className, ...props }, ref) {
  return (
    <BaseContextMenu.RadioItemIndicator
      {...props}
      ref={ref}
      className={className}
      data-slot="context-menu-radio-indicator"
      aria-hidden="true"
    >
      {children}
    </BaseContextMenu.RadioItemIndicator>
  );
});

export type ContextMenuSubmenuRootProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.SubmenuRoot
>;
export const ContextMenuSubmenuRoot: typeof BaseContextMenu.SubmenuRoot =
  BaseContextMenu.SubmenuRoot;

export type ContextMenuSubmenuTriggerProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.SubmenuTrigger
>;

export const ContextMenuSubmenuTrigger = forwardRef<HTMLElement, ContextMenuSubmenuTriggerProps>(
  function ContextMenuSubmenuTrigger({ className, ...props }, ref) {
    return (
      <BaseContextMenu.SubmenuTrigger
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="context-menu-submenu-trigger"
      />
    );
  },
);

export type ContextMenuGroupProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Group>;

export const ContextMenuGroup = forwardRef<HTMLDivElement, ContextMenuGroupProps>(
  function ContextMenuGroup({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Group
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().group, className)}
        data-slot="context-menu-group"
      />
    );
  },
);

export type ContextMenuGroupLabelProps = ComponentPropsWithoutRef<
  typeof BaseContextMenu.GroupLabel
>;

export const ContextMenuGroupLabel = forwardRef<HTMLDivElement, ContextMenuGroupLabelProps>(
  function ContextMenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseContextMenu.GroupLabel
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().groupLabel, className)}
        data-slot="context-menu-group-label"
      />
    );
  },
);

export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<typeof BaseContextMenu.Separator>;

export const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...props }, ref) {
    return (
      <BaseContextMenu.Separator
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().separator, className)}
        data-slot="context-menu-separator"
      />
    );
  },
);

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Backdrop: ContextMenuBackdrop,
  Positioner: ContextMenuPositioner,
  Popup: ContextMenuPopup,
  Arrow: ContextMenuArrow,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  CheckboxItem: ContextMenuCheckboxItem,
  CheckboxItemIndicator: ContextMenuCheckboxItemIndicator,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  RadioItemIndicator: ContextMenuRadioItemIndicator,
  SubmenuRoot: ContextMenuSubmenuRoot,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Separator: ContextMenuSeparator,
};
