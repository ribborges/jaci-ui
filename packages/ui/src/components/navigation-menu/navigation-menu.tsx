"use client";

import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { NavigationMenuRoot as BaseNavigationMenuRoot } from "@base-ui/react/navigation-menu";

import { navigationMenu } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type NavigationMenuOrientation = "horizontal" | "vertical";

interface NavigationMenuContextValue {
  close: () => void;
  orientation: NavigationMenuOrientation;
  styles: ReturnType<typeof navigationMenu>;
  value: string | null;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);
const NavigationMenuItemContext = createContext<{ value?: string } | null>(null);

function useNavigationMenuContext() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("NavigationMenu parts must be rendered inside NavigationMenu.Root.");
  }

  return context;
}

export interface NavigationMenuRootProps
  extends Omit<
    BaseNavigationMenuRoot.Props<string>,
    "children" | "className" | "onValueChange" | "value" | "defaultValue"
  > {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  orientation?: NavigationMenuOrientation;
  children?: ReactNode;
  className?: string;
}

export const NavigationMenuRoot = forwardRef<HTMLElement, NavigationMenuRootProps>(
  function NavigationMenuRoot(
    {
      children,
      className,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      value,
      ...props
    },
    ref,
  ) {
    const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(defaultValue ?? null);
    const rootElementRef = useRef<HTMLElement | null>(null);
    // Keep the Base UI primitive controlled by the wrapper state even when the
    // consumer uses the uncontrolled API. This keeps the viewport and the
    // primitive in sync when Base UI dismisses a menu (pointer leave, outside
    // press, Escape or pressing the trigger again).
    const resolvedValue = value === undefined ? uncontrolledValue : value;
    const styles = navigationMenu({ orientation });
    const close = useCallback(() => {
      if (value === undefined) setUncontrolledValue(null);
      else onValueChange?.(null);
    }, [onValueChange, value]);

    useEffect(() => {
      if (resolvedValue === null) return;
      const handleOutsidePress = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (rootElementRef.current?.contains(target)) return;
        if (
          target.closest(
            '[data-slot="navigation-menu-content"], [data-slot="navigation-menu-positioner"], [data-slot="navigation-menu-popup"], [data-slot="navigation-menu-viewport"]',
          )
        ) {
          return;
        }
        close();
      };
      document.addEventListener("click", handleOutsidePress);
      return () => document.removeEventListener("click", handleOutsidePress);
    }, [close, resolvedValue]);

    const setRootRef = (element: HTMLElement | null) => {
      rootElementRef.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    };

    return (
      <NavigationMenuContext.Provider value={{ close, orientation, styles, value: resolvedValue }}>
        <BaseNavigationMenu.Root
          {...props}
          onValueChange={(next) => {
            if (value === undefined) setUncontrolledValue(next);
            onValueChange?.(next);
          }}
          orientation={orientation}
          ref={setRootRef}
          value={resolvedValue}
          className={withRecipeClassName(styles.root, className)}
          data-jaci-component="navigation-menu"
          data-orientation={orientation}
          data-slot="navigation-menu"
        >
          {children}
        </BaseNavigationMenu.Root>
      </NavigationMenuContext.Provider>
    );
  },
);

export type NavigationMenuListProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>;
export const NavigationMenuList = forwardRef<HTMLUListElement, NavigationMenuListProps>(
  function NavigationMenuList({ className, ...props }, ref) {
    const { styles, orientation } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.List
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.list, className)}
        data-orientation={orientation}
        data-slot="navigation-menu-list"
      />
    );
  },
);

export type NavigationMenuItemProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.Item>;
export const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ children, className, value, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    const generatedValue = useId();
    const itemValue = value ?? generatedValue;
    return (
      <NavigationMenuItemContext.Provider value={{ value: itemValue }}>
        <BaseNavigationMenu.Item
          {...props}
          ref={ref}
          value={itemValue}
          className={withRecipeClassName(styles.item, className)}
          data-slot="navigation-menu-item"
        >
          {children}
        </BaseNavigationMenu.Item>
      </NavigationMenuItemContext.Provider>
    );
  },
);

export type NavigationMenuTriggerProps = ComponentPropsWithoutRef<
  typeof BaseNavigationMenu.Trigger
>;
export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  function NavigationMenuTrigger({ className, onClick, ...props }, ref) {
    const { close, styles, value } = useNavigationMenuContext();
    const item = useContext(NavigationMenuItemContext);
    return (
      <BaseNavigationMenu.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-slot="navigation-menu-trigger"
        onClick={(event) => {
          // Base UI intentionally keeps a hover-opened menu open for a brief
          // patient-click window. For a component library trigger, a second
          // click should always be an explicit close action.
          if (item?.value !== undefined && value === item.value) {
            event.preventDefault();
            close();
          }
          onClick?.(event);
        }}
      />
    );
  },
);

export type NavigationMenuContentProps = ComponentPropsWithoutRef<
  typeof BaseNavigationMenu.Content
>;
export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Content
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.content, className)}
        data-slot="navigation-menu-content"
      />
    );
  },
);

export type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link>;
export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Link
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.link, className)}
        data-slot="navigation-menu-link"
      />
    );
  },
);

export type NavigationMenuIconProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.Icon>;
export const NavigationMenuIcon = forwardRef<HTMLSpanElement, NavigationMenuIconProps>(
  function NavigationMenuIcon({ children = "⌄", className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Icon
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.icon, className)}
        data-slot="navigation-menu-icon"
      >
        {children}
      </BaseNavigationMenu.Icon>
    );
  },
);

export const NavigationMenuPortal = BaseNavigationMenu.Portal;

export type NavigationMenuPositionerProps = ComponentPropsWithoutRef<
  typeof BaseNavigationMenu.Positioner
>;
export const NavigationMenuPositioner = forwardRef<HTMLDivElement, NavigationMenuPositionerProps>(
  function NavigationMenuPositioner({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.positioner, className)}
        data-slot="navigation-menu-positioner"
      />
    );
  },
);

export type NavigationMenuViewportProps = ComponentPropsWithoutRef<
  typeof BaseNavigationMenu.Viewport
>;
export const NavigationMenuViewport = forwardRef<HTMLDivElement, NavigationMenuViewportProps>(
  function NavigationMenuViewport({ className, ...props }, ref) {
    const { styles, value } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Viewport
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.viewport, className)}
        data-open={value !== null ? "true" : "false"}
        data-slot="navigation-menu-viewport"
      />
    );
  },
);

export type NavigationMenuPopupProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.Popup>;
export const NavigationMenuPopup = forwardRef<HTMLElement, NavigationMenuPopupProps>(
  function NavigationMenuPopup({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Popup
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.popup, className)}
        data-slot="navigation-menu-popup"
      />
    );
  },
);

export type NavigationMenuBackdropProps = ComponentPropsWithoutRef<
  typeof BaseNavigationMenu.Backdrop
>;
export const NavigationMenuBackdrop = forwardRef<HTMLDivElement, NavigationMenuBackdropProps>(
  function NavigationMenuBackdrop({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Backdrop
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.backdrop, className)}
        data-slot="navigation-menu-backdrop"
      />
    );
  },
);

export type NavigationMenuArrowProps = ComponentPropsWithoutRef<typeof BaseNavigationMenu.Arrow>;
export const NavigationMenuArrow = forwardRef<HTMLDivElement, NavigationMenuArrowProps>(
  function NavigationMenuArrow({ className, ...props }, ref) {
    const { styles } = useNavigationMenuContext();
    return (
      <BaseNavigationMenu.Arrow
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.arrow, className)}
        data-slot="navigation-menu-arrow"
      />
    );
  },
);

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Icon: NavigationMenuIcon,
  Portal: NavigationMenuPortal,
  Positioner: NavigationMenuPositioner,
  Viewport: NavigationMenuViewport,
  Popup: NavigationMenuPopup,
  Backdrop: NavigationMenuBackdrop,
  Arrow: NavigationMenuArrow,
};
