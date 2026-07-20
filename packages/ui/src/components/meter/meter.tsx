import { Meter as BaseMeter } from "@base-ui/react/meter";
import { createContext, forwardRef, useContext } from "react";
import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

import { meter } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";

export type MeterSize = "sm" | "md" | "lg";
export type MeterTone = "neutral" | "accent" | "success" | "warning" | "danger";

interface MeterContextValue {
  styles: ReturnType<typeof meter>;
}

const MeterContext = createContext<MeterContextValue | null>(null);

function useMeterContext() {
  const context = useContext(MeterContext);
  if (!context) {
    throw new Error("Meter parts must be rendered inside Meter.Root.");
  }

  return context;
}

export interface MeterRootProps extends Omit<BaseMeter.Root.Props, "children" | "className"> {
  size?: MeterSize;
  tone?: MeterTone;
  children?: ReactNode;
  className?: string;
}

export const MeterRoot = forwardRef<HTMLDivElement, MeterRootProps>(function MeterRoot(
  { children, className, size = "md", tone = "accent", value, min = 0, max = 100, ...props },
  ref,
) {
  const styles = meter({ size, tone });
  const safeMax = Number.isFinite(max) && max > min ? max : min + 1;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, min), safeMax) : min;
  const percentage = ((safeValue - min) / (safeMax - min)) * 100;

  return (
    <MeterContext.Provider value={{ styles }}>
      <BaseMeter.Root
        {...props}
        ref={ref}
        max={safeMax}
        min={min}
        value={safeValue}
        className={withRecipeClassName(styles.root, className)}
        data-jaci-component="meter"
        data-slot="meter"
        style={{ "--meter-value": `${percentage}%`, ...props.style } as unknown as CSSProperties}
      >
        {children}
      </BaseMeter.Root>
    </MeterContext.Provider>
  );
});

export type MeterLabelProps = ComponentPropsWithoutRef<typeof BaseMeter.Label>;
export const MeterLabel = forwardRef<HTMLSpanElement, MeterLabelProps>(function MeterLabel(
  { className, ...props },
  ref,
) {
  const { styles } = useMeterContext();
  return (
    <BaseMeter.Label
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.label, className)}
      data-slot="meter-label"
    />
  );
});

export type MeterTrackProps = ComponentPropsWithoutRef<typeof BaseMeter.Track>;
export const MeterTrack = forwardRef<HTMLDivElement, MeterTrackProps>(function MeterTrack(
  { className, ...props },
  ref,
) {
  const { styles } = useMeterContext();
  return (
    <BaseMeter.Track
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.track, className)}
      data-slot="meter-track"
    />
  );
});

export type MeterIndicatorProps = ComponentPropsWithoutRef<typeof BaseMeter.Indicator>;
export const MeterIndicator = forwardRef<HTMLDivElement, MeterIndicatorProps>(
  function MeterIndicator({ className, ...props }, ref) {
    const { styles } = useMeterContext();
    return (
      <BaseMeter.Indicator
        {...props}
        ref={ref}
        className={withRecipeClassName(styles.indicator, className)}
        data-slot="meter-indicator"
      />
    );
  },
);

export type MeterValueProps = ComponentPropsWithoutRef<typeof BaseMeter.Value>;
export const MeterValue = forwardRef<HTMLSpanElement, MeterValueProps>(function MeterValue(
  { className, ...props },
  ref,
) {
  const { styles } = useMeterContext();
  return (
    <BaseMeter.Value
      {...props}
      ref={ref}
      className={withRecipeClassName(styles.value, className)}
      data-slot="meter-value"
    />
  );
});

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  Value: MeterValue,
};
