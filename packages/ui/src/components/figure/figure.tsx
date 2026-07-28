"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Children, createContext, forwardRef, isValidElement, useContext } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { figure as figureStyles } from "../../styled-system/recipes";
import { Image } from "../image";
import type { ImageProps } from "../image";

interface FigureContextValue {
  lightbox: boolean;
  styles: ReturnType<typeof figureStyles>;
}

const FigureContext = createContext<FigureContextValue | null>(null);

function useFigureContext() {
  const value = useContext(FigureContext);
  if (!value) {
    throw new Error("Figure parts must be rendered inside Figure.Root.");
  }
  return value;
}

export type FigureImageProps = ImageProps;

export const FigureImage = forwardRef<HTMLImageElement, FigureImageProps>(function FigureImage(
  { className, lightbox: _lightbox, ...props },
  ref,
) {
  const { lightbox, styles } = useFigureContext();
  const content = (
    <Image
      {...props}
      ref={ref}
      className={cx(styles.image, className)}
      data-slot="figure-image"
      lightbox={false}
    />
  );

  if (!lightbox) {
    return content;
  }

  return (
    <BaseDialog.Trigger
      aria-label="Open image"
      className={styles.trigger}
      data-jaci-component="figure-trigger"
      data-slot="figure-trigger"
    >
      {content}
    </BaseDialog.Trigger>
  );
});

export type FigureCaptionProps = ComponentPropsWithoutRef<"figcaption">;

export const FigureCaption = forwardRef<HTMLElement, FigureCaptionProps>(function FigureCaption(
  { className, ...props },
  ref,
) {
  const { styles } = useFigureContext();
  return (
    <figcaption
      {...props}
      ref={ref}
      className={cx(styles.caption, className)}
      data-slot="figure-caption"
    />
  );
});

export interface FigureRootProps extends ComponentPropsWithoutRef<"figure"> {
  lightbox?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
}

function findChild<T>(children: ReactNode, component: ElementType): ReactElement<T> | null {
  const child = Children.toArray(children).find(
    (item) => isValidElement(item) && item.type === component,
  );
  return (child as ReactElement<T> | undefined) ?? null;
}

export const FigureRoot = forwardRef<HTMLElement, FigureRootProps>(function FigureRoot(
  {
    children,
    className,
    closeLabel = "Close image",
    defaultOpen,
    lightbox = false,
    onOpenChange,
    open,
    ...props
  },
  ref,
) {
  const styles = figureStyles();
  const media = findChild<FigureImageProps>(children, FigureImage);
  const caption = findChild<FigureCaptionProps>(children, FigureCaption);
  const canOpen = Boolean(lightbox && media?.props.src);
  const content = (
    <figure
      {...props}
      ref={ref}
      className={cx(styles.root, className)}
      data-jaci-component="figure"
      data-lightbox={canOpen || undefined}
      data-slot="figure"
    >
      {children}
    </figure>
  );

  const value = { lightbox: canOpen, styles };

  if (!canOpen || !media) {
    return <FigureContext.Provider value={value}>{content}</FigureContext.Provider>;
  }

  const alt = media.props.alt;
  const src = media.props.src;

  return (
    <FigureContext.Provider value={value}>
      <BaseDialog.Root
        defaultOpen={defaultOpen}
        onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
        open={open}
      >
        {content}
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className={styles.backdrop} data-slot="figure-lightbox-backdrop" />
          <BaseDialog.Viewport className={styles.viewport} data-slot="figure-lightbox-viewport">
            <BaseDialog.Popup
              aria-label={alt || "Image preview"}
              className={styles.popup}
              data-jaci-component="figure-lightbox"
              data-slot="figure-lightbox-popup"
            >
              <BaseDialog.Title className={styles.title}>{alt || "Image preview"}</BaseDialog.Title>
              <BaseDialog.Close
                aria-label={closeLabel}
                className={styles.close}
                data-slot="figure-lightbox-close"
              >
                ×
              </BaseDialog.Close>
              <img
                alt={alt}
                className={styles.lightboxImage}
                data-slot="figure-lightbox-image"
                src={src}
              />
              {caption ? (
                <figcaption className={styles.lightboxCaption} data-slot="figure-lightbox-caption">
                  {caption.props.children}
                </figcaption>
              ) : null}
            </BaseDialog.Popup>
          </BaseDialog.Viewport>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </FigureContext.Provider>
  );
});

export const Figure = {
  Root: FigureRoot,
  Image: FigureImage,
  Caption: FigureCaption,
};
