"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { MenuRoot as BaseMenuRoot, MenuTrigger as BaseMenuTrigger } from "@base-ui/react/menu";

import { menu } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

/**
 * Groups the menu parts. It keeps Base UI's controlled `open`/
 * `onOpenChange` API and uncontrolled `defaultOpen` API intact.
 */
export type MenuRootProps<Payload = unknown> = BaseMenuRoot.Props<Payload>;

export function MenuRoot<Payload = unknown>(props: MenuRootProps<Payload>) {
  return <BaseMenu.Root {...props} />;
}

export type MenuTriggerProps<Payload = unknown> = BaseMenuTrigger.Props<Payload>;

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Trigger
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().trigger, className)}
      data-jaci-component="menu"
      data-slot="menu-trigger"
    />
  );
});

/** Preserves Base UI's portal and optional container APIs. */
export const MenuPortal = BaseMenu.Portal;

export type MenuPositionerProps = ComponentPropsWithoutRef<typeof BaseMenu.Positioner>;

export const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>(
  function MenuPositioner({ className, ...props }, ref) {
    return (
      <BaseMenu.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().positioner, className)}
        data-slot="menu-positioner"
      />
    );
  },
);

export type MenuPopupProps = ComponentPropsWithoutRef<typeof BaseMenu.Popup>;

export const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().popup, className)}
      data-slot="menu-popup"
    />
  );
});

export type MenuItemProps = ComponentPropsWithoutRef<typeof BaseMenu.Item>;

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Item
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().item, className)}
      data-slot="menu-item"
    />
  );
});

export type MenuLinkItemProps = ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>;

/**
 * A navigational item. This is the semantic counterpart of the legacy
 * dropdown's link option and retains Base UI's keyboard navigation.
 */
export const MenuLinkItem = forwardRef<Element, MenuLinkItemProps>(function MenuLinkItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.LinkItem
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().item, className)}
      data-slot="menu-link-item"
    />
  );
});

export type MenuSeparatorProps = ComponentPropsWithoutRef<typeof BaseMenu.Separator>;

export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(function MenuSeparator(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Separator
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().separator, className)}
      data-slot="menu-separator"
    />
  );
});

export type MenuGroupProps = ComponentPropsWithoutRef<typeof BaseMenu.Group>;

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Group
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().group, className)}
      data-slot="menu-group"
    />
  );
});

export type MenuGroupLabelProps = ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>;

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  function MenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().groupLabel, className)}
        data-slot="menu-group-label"
      />
    );
  },
);

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  createHandle: BaseMenu.createHandle,
};
