"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { forwardRef, useEffect, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { image } from "../../styled-system/recipes";

export type ImageFit = "contain" | "cover" | "fill" | "none";
export type ImageStatus = "loading" | "loaded" | "error";

export interface ImageProps extends Omit<ComponentPropsWithoutRef<"img">, "children"> {
  alt: string;
  aspectRatio?: number;
  defaultOpen?: boolean;
  fallback?: ReactNode;
  fit?: ImageFit;
  lightbox?: boolean;
  lightboxLabel?: string;
  onOpenChange?: (open: boolean) => void;
  onStatusChange?: (status: ImageStatus) => void;
  open?: boolean;
  position?: string;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    alt,
    aspectRatio,
    className,
    defaultOpen,
    fallback,
    fit = "cover",
    lightbox = false,
    lightboxLabel = "Open image",
    onError,
    onLoad,
    onOpenChange,
    onStatusChange,
    open,
    position,
    src,
    style,
    ...props
  },
  ref,
) {
  const [status, setStatus] = useState<ImageStatus>("loading");

  // The source is intentionally the reset key for the native image lifecycle.
  // biome-ignore lint/correctness/useExhaustiveDependencies: changing src starts a new lifecycle.
  useEffect(() => {
    setStatus("loading");
  }, [src]);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  const styles = image({ fit, status });
  const rootStyle = {
    ...(aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0
      ? { aspectRatio }
      : undefined),
    ...style,
  };

  const content = (
    <span
      aria-busy={status === "loading" || undefined}
      className={styles.root}
      data-fit={fit}
      data-jaci-component="image"
      data-slot="image"
      data-status={status}
      style={rootStyle}
    >
      <img
        {...props}
        ref={ref}
        alt={alt}
        className={cx(styles.image, className)}
        data-slot="image-content"
        onError={(event) => {
          setStatus("error");
          onError?.(event);
        }}
        onLoad={(event) => {
          setStatus("loaded");
          onLoad?.(event);
        }}
        src={src}
        style={{ objectPosition: position }}
      />
      {status === "error" && fallback ? (
        <span aria-live="polite" className={styles.fallback} data-slot="image-fallback">
          {fallback}
        </span>
      ) : null}
    </span>
  );

  if (!lightbox) {
    return content;
  }

  return (
    <BaseDialog.Root
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
      open={open}
    >
      <BaseDialog.Trigger
        aria-label={lightboxLabel}
        className={styles.trigger}
        data-jaci-component="image-trigger"
        data-slot="image-trigger"
      >
        {content}
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} data-slot="image-lightbox-backdrop" />
        <BaseDialog.Viewport className={styles.viewport} data-slot="image-lightbox-viewport">
          <BaseDialog.Popup
            aria-label={alt || lightboxLabel}
            className={styles.popup}
            data-jaci-component="image-lightbox"
            data-slot="image-lightbox-popup"
          >
            <BaseDialog.Title className={styles.title}>{alt || lightboxLabel}</BaseDialog.Title>
            <BaseDialog.Close
              aria-label="Close image"
              className={styles.close}
              data-slot="image-lightbox-close"
            >
              ×
            </BaseDialog.Close>
            <img
              alt={alt}
              className={styles.lightboxImage}
              data-slot="image-lightbox-content"
              src={src}
              style={{ objectPosition: position }}
            />
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
});
