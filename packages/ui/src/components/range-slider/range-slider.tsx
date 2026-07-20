"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SliderRoot as BaseSliderRoot } from "@base-ui/react/slider";

import { rangeSlider } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type RangeSliderSize = "sm" | "md" | "lg";

const RangeSliderSizeContext = createContext<RangeSliderSize>("md");

function useRangeSliderStyles() {
  return rangeSlider({ size: useContext(RangeSliderSizeContext) });
}

export interface RangeSliderRootProps
  extends Omit<
    BaseSliderRoot.Props<readonly number[]>,
    "children" | "className" | "defaultValue" | "value" | "onValueChange" | "onValueCommitted"
  > {
  value?: readonly [number, number];
  defaultValue?: readonly [number, number];
  onValueChange?: (value: readonly [number, number]) => void;
  onValueCommitted?: (value: readonly [number, number]) => void;
  size?: RangeSliderSize;
  children?: ReactNode;
  className?: string;
}

function asRange(values: readonly number[], min: number, max: number): readonly [number, number] {
  return [values[0] ?? min, values[1] ?? max];
}

export const RangeSliderRoot = forwardRef<HTMLDivElement, RangeSliderRootProps>(
  function RangeSliderRoot(
    {
      children,
      className,
      defaultValue,
      max = 100,
      min = 0,
      onValueChange,
      onValueCommitted,
      size = "md",
      value,
      ...props
    },
    ref,
  ) {
    const styles = rangeSlider({ size });
    const fallbackValue = defaultValue ?? [min, max];

    return (
      <RangeSliderSizeContext.Provider value={size}>
        <BaseSlider.Root
          {...props}
          defaultValue={fallbackValue}
          max={max}
          min={min}
          onValueChange={(next) => onValueChange?.(asRange(next, min, max))}
          onValueCommitted={(next) => onValueCommitted?.(asRange(next, min, max))}
          ref={ref}
          value={value}
          className={withRecipeClassName(styles.root, className)}
          data-jaci-component="range-slider"
          data-slot="range-slider"
        >
          {children}
        </BaseSlider.Root>
      </RangeSliderSizeContext.Provider>
    );
  },
);

export type RangeSliderLabelProps = ComponentPropsWithoutRef<typeof BaseSlider.Label>;
export const RangeSliderLabel = forwardRef<HTMLDivElement, RangeSliderLabelProps>(
  function RangeSliderLabel({ className, ...props }, ref) {
    return (
      <BaseSlider.Label
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().label, className)}
        data-slot="range-slider-label"
      />
    );
  },
);

export type RangeSliderValueProps = ComponentPropsWithoutRef<typeof BaseSlider.Value>;
export const RangeSliderValue = forwardRef<HTMLOutputElement, RangeSliderValueProps>(
  function RangeSliderValue({ className, ...props }, ref) {
    return (
      <BaseSlider.Value
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().value, className)}
        data-slot="range-slider-value"
      />
    );
  },
);

export type RangeSliderControlProps = ComponentPropsWithoutRef<typeof BaseSlider.Control>;
export const RangeSliderControl = forwardRef<HTMLDivElement, RangeSliderControlProps>(
  function RangeSliderControl({ className, ...props }, ref) {
    return (
      <BaseSlider.Control
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().control, className)}
        data-slot="range-slider-control"
      />
    );
  },
);

export type RangeSliderTrackProps = ComponentPropsWithoutRef<typeof BaseSlider.Track>;
export const RangeSliderTrack = forwardRef<HTMLDivElement, RangeSliderTrackProps>(
  function RangeSliderTrack({ className, ...props }, ref) {
    return (
      <BaseSlider.Track
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().track, className)}
        data-slot="range-slider-track"
      />
    );
  },
);

export type RangeSliderIndicatorProps = ComponentPropsWithoutRef<typeof BaseSlider.Indicator>;
export const RangeSliderIndicator = forwardRef<HTMLDivElement, RangeSliderIndicatorProps>(
  function RangeSliderIndicator({ className, ...props }, ref) {
    return (
      <BaseSlider.Indicator
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().indicator, className)}
        data-slot="range-slider-indicator"
      />
    );
  },
);

export interface RangeSliderThumbProps extends ComponentPropsWithoutRef<typeof BaseSlider.Thumb> {
  index: 0 | 1;
}

export const RangeSliderThumb = forwardRef<HTMLDivElement, RangeSliderThumbProps>(
  function RangeSliderThumb({ className, ...props }, ref) {
    return (
      <BaseSlider.Thumb
        {...props}
        ref={ref}
        className={withRecipeClassName(useRangeSliderStyles().thumb, className)}
        data-slot="range-slider-thumb"
      />
    );
  },
);

export const RangeSlider = {
  Root: RangeSliderRoot,
  Label: RangeSliderLabel,
  Value: RangeSliderValue,
  Control: RangeSliderControl,
  Track: RangeSliderTrack,
  Indicator: RangeSliderIndicator,
  Thumb: RangeSliderThumb,
};
