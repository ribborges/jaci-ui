"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SliderRoot as BaseSliderRoot } from "@base-ui/react/slider";

import { slider } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type SliderSize = "sm" | "md" | "lg";

const SliderSizeContext = createContext<SliderSize>("md");

function useSliderStyles() {
  return slider({ size: useContext(SliderSizeContext) });
}

export interface SliderRootProps<
  Value extends number | readonly number[] = number | readonly number[],
> extends Omit<BaseSliderRoot.Props<Value>, "children" | "className"> {
  /** Shared visual size for the track and thumb. */
  size?: SliderSize;
  children?: ReactNode;
  className?: string;
}

/**
 * An accessible single-value or range slider. Use `value`/`onValueChange`
 * for controlled state, or `defaultValue` for an uncontrolled slider.
 */
export function SliderRoot<Value extends number | readonly number[] = number | readonly number[]>({
  children,
  className,
  size = "md",
  ...props
}: SliderRootProps<Value>) {
  const styles = slider({ size });

  return (
    <SliderSizeContext.Provider value={size}>
      <BaseSlider.Root
        {...props}
        className={withRecipeClassName(styles.root, className)}
        data-jaci-component="slider"
        data-slot="slider"
      >
        {children}
      </BaseSlider.Root>
    </SliderSizeContext.Provider>
  );
}

export type SliderLabelProps = ComponentPropsWithoutRef<typeof BaseSlider.Label>;

export const SliderLabel = forwardRef<HTMLDivElement, SliderLabelProps>(function SliderLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseSlider.Label
      {...props}
      ref={ref}
      className={withRecipeClassName(useSliderStyles().label, className)}
      data-slot="slider-label"
    />
  );
});

export type SliderValueProps = ComponentPropsWithoutRef<typeof BaseSlider.Value>;

export const SliderValue = forwardRef<HTMLOutputElement, SliderValueProps>(function SliderValue(
  { className, ...props },
  ref,
) {
  return (
    <BaseSlider.Value
      {...props}
      ref={ref}
      className={withRecipeClassName(useSliderStyles().value, className)}
      data-slot="slider-value"
    />
  );
});

export type SliderControlProps = ComponentPropsWithoutRef<typeof BaseSlider.Control>;

export const SliderControl = forwardRef<HTMLDivElement, SliderControlProps>(function SliderControl(
  { className, ...props },
  ref,
) {
  return (
    <BaseSlider.Control
      {...props}
      ref={ref}
      className={withRecipeClassName(useSliderStyles().control, className)}
      data-slot="slider-control"
    />
  );
});

export type SliderTrackProps = ComponentPropsWithoutRef<typeof BaseSlider.Track>;

export const SliderTrack = forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  { className, ...props },
  ref,
) {
  return (
    <BaseSlider.Track
      {...props}
      ref={ref}
      className={withRecipeClassName(useSliderStyles().track, className)}
      data-slot="slider-track"
    />
  );
});

export type SliderIndicatorProps = ComponentPropsWithoutRef<typeof BaseSlider.Indicator>;

export const SliderIndicator = forwardRef<HTMLDivElement, SliderIndicatorProps>(
  function SliderIndicator({ className, ...props }, ref) {
    return (
      <BaseSlider.Indicator
        {...props}
        ref={ref}
        className={withRecipeClassName(useSliderStyles().indicator, className)}
        data-slot="slider-indicator"
      />
    );
  },
);

export type SliderThumbProps = ComponentPropsWithoutRef<typeof BaseSlider.Thumb>;

export const SliderThumb = forwardRef<HTMLDivElement, SliderThumbProps>(function SliderThumb(
  { className, ...props },
  ref,
) {
  return (
    <BaseSlider.Thumb
      {...props}
      ref={ref}
      className={withRecipeClassName(useSliderStyles().thumb, className)}
      data-slot="slider-thumb"
    />
  );
});

export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
};
