"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { DialogRoot as BaseDialogRoot } from "@base-ui/react/dialog";

import { cx } from "../../styled-system/css";
import { bottomNavigation, navbar } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

/**
 * Groups a responsive navigation bar and its mobile drawer. The `open`,
 * `defaultOpen`, and `onOpenChange` props are forwarded to Base UI's Dialog
 * root, which supplies focus management, Escape handling, and backdrop
 * dismissal for `Navbar.Drawer`.
 */
export type NavbarRootProps<Payload = unknown> = BaseDialogRoot.Props<Payload>;

export function NavbarRoot<Payload = unknown>(props: NavbarRootProps<Payload>) {
  return <BaseDialog.Root {...props} />;
}

export const NavbarCreateHandle = BaseDialog.createHandle;

export type NavbarBarProps = ComponentPropsWithoutRef<"nav">;

/** A fixed, translucent zinc navigation surface. */
export const NavbarBar = forwardRef<HTMLElement, NavbarBarProps>(function NavbarBar(
  { className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      className={cx(navbar().bar, className)}
      data-jaci-component="navbar"
      data-slot="navbar-bar"
    />
  );
});

export type NavbarStartProps = ComponentPropsWithoutRef<"div">;

export const NavbarStart = forwardRef<HTMLDivElement, NavbarStartProps>(function NavbarStart(
  { className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={cx(navbar().start, className)} data-slot="navbar-start" />
  );
});

export type NavbarCenterProps = ComponentPropsWithoutRef<"div">;

export const NavbarCenter = forwardRef<HTMLDivElement, NavbarCenterProps>(function NavbarCenter(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(navbar().center, className)}
      data-slot="navbar-center"
    />
  );
});

export type NavbarEndProps = ComponentPropsWithoutRef<"div">;

export const NavbarEnd = forwardRef<HTMLDivElement, NavbarEndProps>(function NavbarEnd(
  { className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={cx(navbar().end, className)} data-slot="navbar-end" />
  );
});

export type NavbarToggleProps = ComponentPropsWithoutRef<typeof BaseDialog.Trigger>;

/**
 * Opens the responsive drawer. It is hidden at the large breakpoint by
 * default, while still allowing a controlled host to render a drawer anywhere.
 */
export const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(function NavbarToggle(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const hasVisibleLabel = children != null;

  return (
    <BaseDialog.Trigger
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Open navigation menu")}
      ref={ref}
      className={withRecipeClassName(navbar().toggle, className)}
      data-slot="navbar-toggle"
    >
      {children ?? "☰"}
    </BaseDialog.Trigger>
  );
});

export type NavbarDrawerPortalProps = Omit<
  ComponentPropsWithoutRef<typeof BaseDialog.Portal>,
  "children"
>;

export interface NavbarDrawerProps extends ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  /** Optional controls for the underlying Base UI portal. */
  portalProps?: NavbarDrawerPortalProps;
}

/**
 * A left-aligned mobile drawer. It intentionally owns the Dialog portal,
 * backdrop, viewport, and popup so consumers cannot accidentally omit the
 * pieces required for focus trapping and Escape/backdrop dismissal.
 */
export const NavbarDrawer = forwardRef<HTMLDivElement, NavbarDrawerProps>(function NavbarDrawer(
  { "aria-label": ariaLabel, children, className, portalProps, ...props },
  ref,
) {
  const styles = navbar();

  return (
    <BaseDialog.Portal {...portalProps}>
      <BaseDialog.Backdrop
        className={withRecipeClassName(styles.drawerBackdrop, undefined)}
        data-slot="navbar-drawer-backdrop"
      />
      <BaseDialog.Viewport
        className={withRecipeClassName(styles.drawerViewport, undefined)}
        data-slot="navbar-drawer-viewport"
      >
        <BaseDialog.Popup
          {...props}
          aria-label={ariaLabel ?? "Navigation menu"}
          ref={ref}
          className={withRecipeClassName(styles.drawer, className)}
          data-jaci-component="navbar"
          data-slot="navbar-drawer"
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
});

export type NavbarCloseProps = ComponentPropsWithoutRef<typeof BaseDialog.Close>;

/** A close affordance for use inside `Navbar.Drawer`. */
export const NavbarClose = forwardRef<HTMLButtonElement, NavbarCloseProps>(function NavbarClose(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const hasVisibleLabel = children != null;

  return (
    <BaseDialog.Close
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Close navigation menu")}
      ref={ref}
      className={withRecipeClassName(navbar().close, className)}
      data-slot="navbar-close"
    >
      {children ?? "×"}
    </BaseDialog.Close>
  );
});

export interface NavbarItemProps extends ComponentPropsWithoutRef<"a"> {
  /** Marks the current navigation destination. */
  active?: boolean;
}

/** A semantic navigation link for either the fixed bar or mobile drawer. */
export const NavbarItem = forwardRef<HTMLAnchorElement, NavbarItemProps>(function NavbarItem(
  { "aria-current": ariaCurrent, active = false, className, ...props },
  ref,
) {
  return (
    <a
      {...props}
      aria-current={ariaCurrent ?? (active ? "page" : undefined)}
      ref={ref}
      className={cx(navbar({ active }).item, className)}
      data-active={active || undefined}
      data-slot="navbar-item"
    />
  );
});

export type BottomNavigationProps = ComponentPropsWithoutRef<"nav">;

/**
 * A compact floating navigation bar for small-screen destinations. It is
 * independent from `Navbar` so it can be used in layouts without a drawer.
 */
export const BottomNavigationRoot = forwardRef<HTMLElement, BottomNavigationProps>(
  function BottomNavigationRoot({ className, ...props }, ref) {
    return (
      <nav
        {...props}
        ref={ref}
        className={cx(bottomNavigation().root, className)}
        data-jaci-component="bottom-navigation"
        data-slot="bottom-navigation"
      />
    );
  },
);

export interface BottomNavigationItemProps extends ComponentPropsWithoutRef<"a"> {
  /** Marks the current navigation destination. */
  active?: boolean;
}

export const BottomNavigationItem = forwardRef<HTMLAnchorElement, BottomNavigationItemProps>(
  function BottomNavigationItem(
    { "aria-current": ariaCurrent, active = false, className, ...props },
    ref,
  ) {
    return (
      <a
        {...props}
        aria-current={ariaCurrent ?? (active ? "page" : undefined)}
        ref={ref}
        className={cx(bottomNavigation({ active }).item, className)}
        data-active={active || undefined}
        data-slot="bottom-navigation-item"
      />
    );
  },
);

export const BottomNavigation = Object.assign(BottomNavigationRoot, {
  Item: BottomNavigationItem,
});
