"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { createContext, forwardRef, useCallback, useContext, useMemo, useState } from "react";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { sidebar } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";

export interface SidebarContextValue {
  /** Whether the sidebar is visually expanded. */
  open: boolean;
  /** Updates the expanded state, respecting controlled usage. */
  setOpen: (open: boolean) => void;
  /** Convenience callback for toggles placed anywhere in the sidebar. */
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Reads the state exposed by `Sidebar.Root`.
 *
 * Use it in custom sidebar parts when the built-in composition is not enough.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.Root component.");
  }

  return context;
}

function useSidebarStyles() {
  const { open } = useSidebar();
  return sidebar({ open });
}

export interface SidebarRootProps extends ComponentPropsWithoutRef<"aside"> {
  /** Controlled expanded state. */
  open?: boolean;
  /** Initial expanded state for uncontrolled use. */
  defaultOpen?: boolean;
  /** Called after the requested expanded state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Renders the sidebar as a modal mobile surface when set to overlay. */
  mode?: "static" | "overlay";
  /** Allows Escape to be disabled for overlay mode. */
  closeOnEscape?: boolean;
  /** Allows outside presses to be disabled for overlay mode. */
  closeOnOutsidePress?: boolean;
  /** Restores focus to the element that opened the overlay. */
  restoreFocus?: boolean;
  /** Controls whether the overlay traps focus and locks page scroll. */
  modal?: boolean | "trap-focus";
  children?: ReactNode;
}

/**
 * The sidebar container. It supports both controlled and uncontrolled state.
 */
export const SidebarRoot = forwardRef<HTMLElement, SidebarRootProps>(function SidebarRoot(
  {
    children,
    className,
    closeOnEscape = true,
    closeOnOutsidePress = true,
    defaultOpen = true,
    modal = true,
    mode = "static",
    onOpenChange,
    open: controlledOpen,
    restoreFocus = true,
    ...props
  },
  ref,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const context = useMemo<SidebarContextValue>(
    () => ({ open, setOpen, toggle }),
    [open, setOpen, toggle],
  );
  const styles = sidebar({ open });
  const scopedPortalProps = useThemePortalProps({});

  const surface = (
    <aside
      {...props}
      ref={ref}
      className={cx(styles.root, className)}
      data-jaci-component="sidebar"
      data-open={open}
      data-slot="sidebar"
      data-state={open ? "open" : "closed"}
    >
      {children}
    </aside>
  );

  if (mode === "overlay") {
    return (
      <SidebarContext.Provider value={context}>
        <BaseDialog.Root
          open={open}
          modal={modal}
          onOpenChange={(nextOpen, details) => {
            if (
              !nextOpen &&
              ((!closeOnEscape && details.reason === "escape-key") ||
                (!closeOnOutsidePress && details.reason === "outside-press"))
            ) {
              details.cancel();
              return;
            }
            setOpen(nextOpen);
          }}
        >
          <BaseDialog.Portal {...scopedPortalProps}>
            <BaseDialog.Backdrop
              className={cx(styles.backdrop)}
              data-jaci-component="sidebar"
              data-slot="sidebar-backdrop"
            />
            <BaseDialog.Viewport className={cx(styles.viewport)} data-slot="sidebar-viewport">
              <BaseDialog.Popup
                aria-label={props["aria-label"] ?? "Sidebar navigation"}
                className={cx(styles.popup)}
                data-jaci-component="sidebar"
                data-slot="sidebar-popup"
                finalFocus={restoreFocus}
                initialFocus
              >
                {surface}
              </BaseDialog.Popup>
            </BaseDialog.Viewport>
          </BaseDialog.Portal>
        </BaseDialog.Root>
      </SidebarContext.Provider>
    );
  }

  return <SidebarContext.Provider value={context}>{surface}</SidebarContext.Provider>;
});

export type SidebarPortalProps = ComponentPropsWithoutRef<typeof BaseDialog.Portal>;
export function SidebarPortal(props: SidebarPortalProps) {
  return <BaseDialog.Portal {...useThemePortalProps(props)} />;
}

export type SidebarBackdropProps = ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>;
export const SidebarBackdrop = forwardRef<HTMLDivElement, SidebarBackdropProps>(
  function SidebarBackdrop({ className, ...props }, ref) {
    const { open } = useSidebar();
    return (
      <BaseDialog.Backdrop
        {...props}
        className={withRecipeClassName(sidebar({ open }).backdrop, className)}
        data-slot="sidebar-backdrop"
        ref={ref}
      />
    );
  },
);

export type SidebarToggleProps = ComponentPropsWithoutRef<"button">;

/**
 * A floating, accessible control that expands or collapses the sidebar.
 */
export const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarToggle(
    { "aria-label": ariaLabel, children, className, onClick, type = "button", ...props },
    ref,
  ) {
    const { open, toggle } = useSidebar();
    const styles = useSidebarStyles();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        toggle();
      }
    };

    return (
      <button
        {...props}
        aria-expanded={open}
        aria-label={ariaLabel ?? (open ? "Collapse sidebar" : "Expand sidebar")}
        className={cx(styles.toggle, className)}
        data-slot="sidebar-toggle"
        onClick={handleClick}
        ref={ref}
        type={type}
      >
        {children ?? <span aria-hidden="true">{open ? "‹" : "›"}</span>}
      </button>
    );
  },
);

export type SidebarHeaderProps = ComponentPropsWithoutRef<"header">;

export const SidebarHeader = forwardRef<HTMLElement, SidebarHeaderProps>(function SidebarHeader(
  { className, ...props },
  ref,
) {
  const styles = useSidebarStyles();

  return (
    <header
      {...props}
      ref={ref}
      className={cx(styles.header, className)}
      data-slot="sidebar-header"
    />
  );
});

export type SidebarContentProps = ComponentPropsWithoutRef<"nav">;

export const SidebarContent = forwardRef<HTMLElement, SidebarContentProps>(function SidebarContent(
  { "aria-label": ariaLabel, className, ...props },
  ref,
) {
  const styles = useSidebarStyles();

  return (
    <nav
      {...props}
      aria-label={ariaLabel ?? "Sidebar navigation"}
      ref={ref}
      className={cx(styles.content, className)}
      data-slot="sidebar-content"
    />
  );
});

export type SidebarFooterProps = ComponentPropsWithoutRef<"footer">;

export const SidebarFooter = forwardRef<HTMLElement, SidebarFooterProps>(function SidebarFooter(
  { className, ...props },
  ref,
) {
  const styles = useSidebarStyles();

  return (
    <footer
      {...props}
      ref={ref}
      className={cx(styles.footer, className)}
      data-slot="sidebar-footer"
    />
  );
});

export interface SidebarItemProps extends ComponentPropsWithoutRef<"a"> {
  /** Marks the current navigation destination. */
  active?: boolean;
}

/**
 * A semantic navigation item. Pair its icon/content with `Sidebar.Label` so
 * the text transitions out of view while remaining available to assistive
 * technology when the sidebar is collapsed.
 */
export const SidebarItem = forwardRef<HTMLAnchorElement, SidebarItemProps>(function SidebarItem(
  { "aria-current": ariaCurrent, active = false, className, ...props },
  ref,
) {
  const { open } = useSidebar();
  const styles = sidebar({ active, open });

  return (
    <a
      {...props}
      aria-current={ariaCurrent ?? (active ? "page" : undefined)}
      ref={ref}
      className={cx(styles.item, className)}
      data-active={active || undefined}
      data-slot="sidebar-item"
    />
  );
});

export type SidebarLabelProps = ComponentPropsWithoutRef<"span">;

export const SidebarLabel = forwardRef<HTMLSpanElement, SidebarLabelProps>(function SidebarLabel(
  { className, ...props },
  ref,
) {
  const styles = useSidebarStyles();

  return (
    <span {...props} ref={ref} className={cx(styles.label, className)} data-slot="sidebar-label" />
  );
});

export const Sidebar = {
  Root: SidebarRoot,
  Portal: SidebarPortal,
  Backdrop: SidebarBackdrop,
  Toggle: SidebarToggle,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Item: SidebarItem,
  Label: SidebarLabel,
};
