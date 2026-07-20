"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { scrollArea } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type ScrollAreaRootProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Root>;

export const ScrollAreaRoot = forwardRef<HTMLDivElement, ScrollAreaRootProps>(
  function ScrollAreaRoot({ className, ...props }, ref) {
    return (
      <BaseScrollArea.Root
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().root, className)}
        data-jaci-component="scroll-area"
        data-slot="scroll-area"
      />
    );
  },
);

export type ScrollAreaViewportProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>;

export const ScrollAreaViewport = forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  function ScrollAreaViewport({ className, ...props }, ref) {
    return (
      <BaseScrollArea.Viewport
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().viewport, className)}
        data-slot="scroll-area-viewport"
      />
    );
  },
);

export type ScrollAreaContentProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Content>;

export const ScrollAreaContent = forwardRef<HTMLDivElement, ScrollAreaContentProps>(
  function ScrollAreaContent({ className, ...props }, ref) {
    return (
      <BaseScrollArea.Content
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().content, className)}
        data-slot="scroll-area-content"
      />
    );
  },
);

export type ScrollAreaScrollbarProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar>;

export const ScrollAreaScrollbar = forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  function ScrollAreaScrollbar({ className, orientation = "vertical", ...props }, ref) {
    return (
      <BaseScrollArea.Scrollbar
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().scrollbar, className)}
        data-orientation={orientation}
        data-slot="scroll-area-scrollbar"
        orientation={orientation}
      />
    );
  },
);

export type ScrollAreaThumbProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Thumb>;

export const ScrollAreaThumb = forwardRef<HTMLDivElement, ScrollAreaThumbProps>(
  function ScrollAreaThumb({ className, ...props }, ref) {
    return (
      <BaseScrollArea.Thumb
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().thumb, className)}
        data-slot="scroll-area-thumb"
      />
    );
  },
);

export type ScrollAreaCornerProps = ComponentPropsWithoutRef<typeof BaseScrollArea.Corner>;

export const ScrollAreaCorner = forwardRef<HTMLDivElement, ScrollAreaCornerProps>(
  function ScrollAreaCorner({ className, ...props }, ref) {
    return (
      <BaseScrollArea.Corner
        {...props}
        ref={ref}
        className={withRecipeClassName(scrollArea().corner, className)}
        data-slot="scroll-area-corner"
      />
    );
  },
);

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
};
