"use client";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { createContext, forwardRef, useContext, useMemo } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { DrawerRoot as BaseDrawerRoot } from "@base-ui/react/drawer";

import { cx } from "../../styled-system/css";
import { drawer } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";

export type DrawerSide = "bottom" | "left" | "right" | "top";
export type DrawerSize = "sm" | "md" | "lg";

interface DrawerContextValue {
  side: DrawerSide;
  size: DrawerSize;
  styles: ReturnType<typeof drawer>;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer parts must be rendered inside Drawer.Root.");
  }

  return context;
}

export interface DrawerRootProps<Payload = unknown>
  extends Omit<BaseDrawerRoot.Props<Payload>, "children"> {
  /** Side from which the drawer enters. */
  side?: DrawerSide;
  /** Shared spacing scale for the drawer content. */
  size?: DrawerSize;
  children?: BaseDrawerRoot.Props<Payload>["children"];
}

export function DrawerRoot<Payload = unknown>({
  children,
  side = "bottom",
  size = "md",
  ...props
}: DrawerRootProps<Payload>) {
  const styles = drawer({ size });
  const context = useMemo(() => ({ side, size, styles }), [side, size, styles]);
  const swipeDirection =
    props.swipeDirection ?? (side === "bottom" ? "down" : side === "top" ? "up" : side);

  return (
    <DrawerContext.Provider value={context}>
      <BaseDrawer.Root {...props} swipeDirection={swipeDirection}>
        {children}
      </BaseDrawer.Root>
    </DrawerContext.Provider>
  );
}

export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof BaseDrawer.Trigger>;

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  function DrawerTrigger({ className, ...props }, ref) {
    const { styles } = useDrawerContext();

    return (
      <BaseDrawer.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.trigger, className)}
        data-slot="drawer-trigger"
      />
    );
  },
);

export type DrawerPortalProps = ComponentPropsWithoutRef<typeof BaseDrawer.Portal>;
export function DrawerPortal(props: DrawerPortalProps) {
  return <BaseDrawer.Portal {...useThemePortalProps(props)} />;
}

export type DrawerBackdropProps = ComponentPropsWithoutRef<typeof BaseDrawer.Backdrop>;

export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>(
  function DrawerBackdrop({ className, ...props }, ref) {
    const { styles } = useDrawerContext();

    return (
      <BaseDrawer.Backdrop
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.backdrop, className)}
        data-slot="drawer-backdrop"
      />
    );
  },
);

export type DrawerViewportProps = ComponentPropsWithoutRef<typeof BaseDrawer.Viewport>;

export const DrawerViewport = forwardRef<HTMLDivElement, DrawerViewportProps>(
  function DrawerViewport({ className, ...props }, ref) {
    const { styles } = useDrawerContext();

    return (
      <BaseDrawer.Viewport
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.viewport, className)}
        data-slot="drawer-viewport"
      />
    );
  },
);

export interface DrawerPopupProps extends ComponentPropsWithoutRef<typeof BaseDrawer.Popup> {
  /** Overrides the side configured on `Drawer.Root`. */
  side?: DrawerSide;
  /** Overrides the size configured on `Drawer.Root`. */
  size?: DrawerSize;
}

export const DrawerPopup = forwardRef<HTMLDivElement, DrawerPopupProps>(function DrawerPopup(
  { "aria-label": ariaLabel, className, side: popupSide, size: popupSize, ...props },
  ref,
) {
  const { side: rootSide, size: rootSize, styles: rootStyles } = useDrawerContext();
  const side = popupSide ?? rootSide;
  const styles = popupSize && popupSize !== rootSize ? drawer({ size: popupSize }) : rootStyles;

  return (
    <BaseDrawer.Popup
      {...props}
      aria-label={ariaLabel ?? "Drawer"}
      data-jaci-component="drawer"
      data-side={side}
      data-slot="drawer-popup"
      ref={ref}
      className={withRecipeClassName(styles.popup, className)}
    />
  );
});

export type DrawerContentProps = ComponentPropsWithoutRef<typeof BaseDrawer.Content>;

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(
  { className, ...props },
  ref,
) {
  const { styles } = useDrawerContext();

  return (
    <BaseDrawer.Content
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.content, className)}
      data-slot="drawer-content"
    />
  );
});

export type DrawerHeaderProps = ComponentPropsWithoutRef<"div">;

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader(
  { className, ...props },
  ref,
) {
  const { styles } = useDrawerContext();
  return (
    <div {...props} ref={ref} className={cx(styles.header, className)} data-slot="drawer-header" />
  );
});

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof BaseDrawer.Title>;

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(function DrawerTitle(
  { className, ...props },
  ref,
) {
  const { styles } = useDrawerContext();
  return (
    <BaseDrawer.Title
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.title, className)}
      data-slot="drawer-title"
    />
  );
});

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof BaseDrawer.Description>;

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  function DrawerDescription({ className, ...props }, ref) {
    const { styles } = useDrawerContext();
    return (
      <BaseDrawer.Description
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.description, className)}
        data-slot="drawer-description"
      />
    );
  },
);

export type DrawerFooterProps = ComponentPropsWithoutRef<"div">;

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { className, ...props },
  ref,
) {
  const { styles } = useDrawerContext();
  return (
    <div {...props} ref={ref} className={cx(styles.footer, className)} data-slot="drawer-footer" />
  );
});

export type DrawerCloseProps = ComponentPropsWithoutRef<typeof BaseDrawer.Close>;

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(function DrawerClose(
  { "aria-label": ariaLabel, children, className, ...props },
  ref,
) {
  const { styles } = useDrawerContext();
  const hasVisibleLabel = children != null;

  return (
    <BaseDrawer.Close
      {...props}
      aria-label={ariaLabel ?? (hasVisibleLabel ? undefined : "Close drawer")}
      ref={ref}
      className={withRecipeClassName(hasVisibleLabel ? styles.action : styles.close, className)}
      data-slot="drawer-close"
    >
      {children ?? "×"}
    </BaseDrawer.Close>
  );
});

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Backdrop: DrawerBackdrop,
  Viewport: DrawerViewport,
  Popup: DrawerPopup,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Close: DrawerClose,
  createHandle: BaseDrawer.createHandle,
};
