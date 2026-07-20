"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { AvatarRoot as BaseAvatarRoot } from "@base-ui/react/avatar";

import { avatar } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded";

interface AvatarStyleContextValue {
  hasAccessibleLabel: boolean;
  shape: AvatarShape;
  size: AvatarSize;
}

const AvatarStyleContext = createContext<AvatarStyleContextValue>({
  hasAccessibleLabel: false,
  shape: "circle",
  size: "md",
});

function useAvatarStyleContext() {
  return useContext(AvatarStyleContext);
}

function useAvatarStyles() {
  const { shape, size } = useAvatarStyleContext();

  return avatar({ shape, size });
}

export interface AvatarRootProps extends BaseAvatarRoot.Props {
  children?: ReactNode;
  shape?: AvatarShape;
  size?: AvatarSize;
}

/**
 * Groups an image and text fallback in a fixed-size avatar. Base UI controls
 * the image lifecycle, so only one accessible representation is mounted at a
 * time and the initial server render remains deterministic.
 */
export const AvatarRoot = forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    children,
    className,
    role,
    shape = "circle",
    size = "md",
    ...props
  },
  ref,
) {
  const styles = avatar({ shape, size });
  const hasAccessibleLabel = Boolean(ariaLabel || ariaLabelledBy);

  return (
    <AvatarStyleContext.Provider value={{ hasAccessibleLabel, shape, size }}>
      <BaseAvatar.Root
        {...props}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        ref={ref}
        className={withRecipeClassName(styles.root, className)}
        data-jaci-component="avatar"
        data-shape={shape}
        data-size={size}
        data-slot="avatar"
        role={role ?? (hasAccessibleLabel ? "img" : undefined)}
      >
        {children}
      </BaseAvatar.Root>
    </AvatarStyleContext.Provider>
  );
});

export interface AvatarImageProps
  extends Omit<ComponentPropsWithoutRef<typeof BaseAvatar.Image>, "alt"> {
  /** Use an empty string explicitly when the image is decorative. */
  alt: string;
}

/** The optional image layer. It is mounted by Base UI only after loading. */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(function AvatarImage(
  { alt, className, ...props },
  ref,
) {
  const { hasAccessibleLabel } = useAvatarStyleContext();

  return (
    <BaseAvatar.Image
      {...props}
      alt={hasAccessibleLabel ? "" : alt}
      aria-hidden={hasAccessibleLabel || undefined}
      ref={ref}
      className={withRecipeClassName(useAvatarStyles().image, className)}
      data-slot="avatar-image"
    />
  );
});

export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>;

/** Textual initials or an icon shown whenever an image is unavailable. */
export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ "aria-hidden": ariaHidden, className, ...props }, ref) {
    const { hasAccessibleLabel } = useAvatarStyleContext();

    return (
      <BaseAvatar.Fallback
        {...props}
        aria-hidden={ariaHidden ?? (hasAccessibleLabel || undefined)}
        ref={ref}
        className={withRecipeClassName(useAvatarStyles().fallback, className)}
        data-slot="avatar-fallback"
      />
    );
  },
);

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
