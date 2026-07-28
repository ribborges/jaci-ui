"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { MenuRoot as BaseMenuRoot } from "@base-ui/react/menu";

import { menu, menubar } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";

export type MenubarOrientation = "horizontal" | "vertical";

interface MenubarContextValue {
  orientation: MenubarOrientation;
  styles: ReturnType<typeof menubar>;
}

const MenubarContext = createContext<MenubarContextValue | null>(null);

function useMenubarContext() {
  const context = useContext(MenubarContext);
  if (!context) {
    throw new Error("Menubar parts must be rendered inside Menubar.Root.");
  }

  return context;
}

export interface MenubarRootProps extends ComponentPropsWithoutRef<typeof BaseMenubar> {
  orientation?: MenubarOrientation;
}

/**
 * A horizontal or vertical command bar. Each `Menubar.Menu` owns one
 * keyboard-navigable menu while the root coordinates arrow-key movement.
 */
export const MenubarRoot = forwardRef<HTMLDivElement, MenubarRootProps>(function MenubarRoot(
  { className, orientation = "horizontal", ...props },
  ref,
) {
  const styles = menubar({ orientation });

  return (
    <MenubarContext.Provider value={{ orientation, styles }}>
      <BaseMenubar
        {...props}
        ref={ref}
        orientation={orientation}
        className={withRecipeClassName(styles.root, className)}
        data-jaci-component="menubar"
        data-orientation={orientation}
        data-slot="menubar"
      />
    </MenubarContext.Provider>
  );
});

export interface MenubarMenuProps<Payload = unknown> extends BaseMenuRoot.Props<Payload> {}

export function MenubarMenu<Payload = unknown>(props: MenubarMenuProps<Payload>) {
  return <BaseMenu.Root {...props} />;
}

export type MenubarTriggerProps = ComponentPropsWithoutRef<typeof BaseMenu.Trigger>;

export const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  function MenubarTrigger({ className, ...props }, ref) {
    const { styles } = useMenubarContext();

    return (
      <BaseMenu.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-jaci-component="menubar"
        data-slot="menubar-trigger"
      />
    );
  },
);

export type MenubarPortalProps = ComponentPropsWithoutRef<typeof BaseMenu.Portal>;
export function MenubarPortal(props: MenubarPortalProps) {
  return <BaseMenu.Portal {...useThemePortalProps(props)} />;
}

export type MenubarPositionerProps = ComponentPropsWithoutRef<typeof BaseMenu.Positioner>;

export const MenubarPositioner = forwardRef<HTMLDivElement, MenubarPositionerProps>(
  function MenubarPositioner({ className, ...props }, ref) {
    return (
      <BaseMenu.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().positioner, className)}
        data-slot="menubar-positioner"
      />
    );
  },
);

export type MenubarPopupProps = ComponentPropsWithoutRef<typeof BaseMenu.Popup>;

export const MenubarPopup = forwardRef<HTMLDivElement, MenubarPopupProps>(function MenubarPopup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Popup
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().popup, className)}
      data-slot="menubar-popup"
    />
  );
});

export type MenubarArrowProps = ComponentPropsWithoutRef<typeof BaseMenu.Arrow>;

export const MenubarArrow = forwardRef<HTMLDivElement, MenubarArrowProps>(function MenubarArrow(
  { className, ...props },
  ref,
) {
  return <BaseMenu.Arrow {...props} ref={ref} className={className} data-slot="menubar-arrow" />;
});

export type MenubarItemProps = ComponentPropsWithoutRef<typeof BaseMenu.Item>;

export const MenubarItem = forwardRef<HTMLElement, MenubarItemProps>(function MenubarItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Item
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().item, className)}
      data-slot="menubar-item"
    />
  );
});

export type MenubarLinkItemProps = ComponentPropsWithoutRef<typeof BaseMenu.LinkItem>;

export const MenubarLinkItem = forwardRef<Element, MenubarLinkItemProps>(function MenubarLinkItem(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.LinkItem
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().item, className)}
      data-slot="menubar-link-item"
    />
  );
});

export type MenubarGroupProps = ComponentPropsWithoutRef<typeof BaseMenu.Group>;

export const MenubarGroup = forwardRef<HTMLDivElement, MenubarGroupProps>(function MenubarGroup(
  { className, ...props },
  ref,
) {
  return (
    <BaseMenu.Group
      {...props}
      ref={ref}
      className={withRecipeClassName(menu().group, className)}
      data-slot="menubar-group"
    />
  );
});

export type MenubarGroupLabelProps = ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>;

export const MenubarGroupLabel = forwardRef<HTMLDivElement, MenubarGroupLabelProps>(
  function MenubarGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().groupLabel, className)}
        data-slot="menubar-group-label"
      />
    );
  },
);

export type MenubarSeparatorProps = ComponentPropsWithoutRef<typeof BaseMenu.Separator>;

export const MenubarSeparator = forwardRef<HTMLDivElement, MenubarSeparatorProps>(
  function MenubarSeparator({ className, ...props }, ref) {
    return (
      <BaseMenu.Separator
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().separator, className)}
        data-slot="menubar-separator"
      />
    );
  },
);

export type MenubarCheckboxItemProps = ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>;

export const MenubarCheckboxItem = forwardRef<HTMLElement, MenubarCheckboxItemProps>(
  function MenubarCheckboxItem({ className, ...props }, ref) {
    return (
      <BaseMenu.CheckboxItem
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="menubar-checkbox-item"
      />
    );
  },
);

export type MenubarCheckboxItemIndicatorProps = ComponentPropsWithoutRef<
  typeof BaseMenu.CheckboxItemIndicator
>;

export const MenubarCheckboxItemIndicator = forwardRef<
  HTMLSpanElement,
  MenubarCheckboxItemIndicatorProps
>(function MenubarCheckboxItemIndicator({ children = "✓", className, ...props }, ref) {
  return (
    <BaseMenu.CheckboxItemIndicator
      {...props}
      ref={ref}
      className={className}
      data-slot="menubar-checkbox-indicator"
      aria-hidden="true"
    >
      {children}
    </BaseMenu.CheckboxItemIndicator>
  );
});

export type MenubarRadioGroupProps = ComponentPropsWithoutRef<typeof BaseMenu.RadioGroup>;
export const MenubarRadioGroup: typeof BaseMenu.RadioGroup = BaseMenu.RadioGroup;

export type MenubarRadioItemProps = ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>;

export const MenubarRadioItem = forwardRef<HTMLElement, MenubarRadioItemProps>(
  function MenubarRadioItem({ className, ...props }, ref) {
    return (
      <BaseMenu.RadioItem
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="menubar-radio-item"
      />
    );
  },
);

export type MenubarRadioItemIndicatorProps = ComponentPropsWithoutRef<
  typeof BaseMenu.RadioItemIndicator
>;

export const MenubarRadioItemIndicator = forwardRef<
  HTMLSpanElement,
  MenubarRadioItemIndicatorProps
>(function MenubarRadioItemIndicator({ children = "•", className, ...props }, ref) {
  return (
    <BaseMenu.RadioItemIndicator
      {...props}
      ref={ref}
      className={className}
      data-slot="menubar-radio-indicator"
      aria-hidden="true"
    >
      {children}
    </BaseMenu.RadioItemIndicator>
  );
});

export type MenubarSubmenuRootProps = ComponentPropsWithoutRef<typeof BaseMenu.SubmenuRoot>;
export const MenubarSubmenuRoot: typeof BaseMenu.SubmenuRoot = BaseMenu.SubmenuRoot;

export type MenubarSubmenuTriggerProps = ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger>;

export const MenubarSubmenuTrigger = forwardRef<HTMLElement, MenubarSubmenuTriggerProps>(
  function MenubarSubmenuTrigger({ className, ...props }, ref) {
    return (
      <BaseMenu.SubmenuTrigger
        {...props}
        ref={ref}
        className={withRecipeClassName(menu().item, className)}
        data-slot="menubar-submenu-trigger"
      />
    );
  },
);

export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  Trigger: MenubarTrigger,
  Portal: MenubarPortal,
  Positioner: MenubarPositioner,
  Popup: MenubarPopup,
  Arrow: MenubarArrow,
  Item: MenubarItem,
  LinkItem: MenubarLinkItem,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  Separator: MenubarSeparator,
  CheckboxItem: MenubarCheckboxItem,
  CheckboxItemIndicator: MenubarCheckboxItemIndicator,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  RadioItemIndicator: MenubarRadioItemIndicator,
  SubmenuRoot: MenubarSubmenuRoot,
  SubmenuTrigger: MenubarSubmenuTrigger,
  createHandle: BaseMenu.createHandle,
};
