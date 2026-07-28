import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { stat, statGroup } from "../../styled-system/recipes";

export type StatTone = "neutral" | "accent" | "success" | "warning" | "danger";
export type StatSize = "sm" | "md" | "lg";
export type StatTrendDirection = "up" | "down" | "neutral";

interface StatContextValue {
  size: StatSize;
  styles: ReturnType<typeof stat>;
  tone: StatTone;
}

const StatContext = createContext<StatContextValue | null>(null);

function useStatContext() {
  const context = useContext(StatContext);
  if (!context) {
    throw new Error("Stat parts must be rendered inside Stat.Root.");
  }

  return context;
}

export interface StatRootProps extends ComponentPropsWithoutRef<"article"> {
  size?: StatSize;
  tone?: StatTone;
}

export const StatRoot = forwardRef<HTMLElement, StatRootProps>(function StatRoot(
  { children, className, size = "md", tone = "neutral", ...props },
  ref,
) {
  const styles = stat({ size, tone });

  return (
    <StatContext.Provider value={{ size, styles, tone }}>
      <article
        {...props}
        ref={ref}
        className={cx(styles.root, className)}
        data-jaci-component="stat"
        data-size={size}
        data-slot="stat"
        data-tone={tone}
      >
        {children}
      </article>
    </StatContext.Provider>
  );
});

export type StatIconProps = ComponentPropsWithoutRef<"span">;
export const StatIcon = forwardRef<HTMLSpanElement, StatIconProps>(function StatIcon(
  { className, ...props },
  ref,
) {
  const { styles } = useStatContext();
  return <span {...props} ref={ref} className={cx(styles.icon, className)} data-slot="stat-icon" />;
});

export type StatLabelProps = ComponentPropsWithoutRef<"span">;
export const StatLabel = forwardRef<HTMLSpanElement, StatLabelProps>(function StatLabel(
  { className, ...props },
  ref,
) {
  const { styles } = useStatContext();
  return (
    <span {...props} ref={ref} className={cx(styles.label, className)} data-slot="stat-label" />
  );
});

export type StatValueProps = ComponentPropsWithoutRef<"strong">;
export const StatValue = forwardRef<HTMLElement, StatValueProps>(function StatValue(
  { className, ...props },
  ref,
) {
  const { styles } = useStatContext();
  return (
    <strong {...props} ref={ref} className={cx(styles.value, className)} data-slot="stat-value" />
  );
});

export type StatDescriptionProps = ComponentPropsWithoutRef<"p">;
export const StatDescription = forwardRef<HTMLParagraphElement, StatDescriptionProps>(
  function StatDescription({ className, ...props }, ref) {
    const { styles } = useStatContext();
    return (
      <p
        {...props}
        ref={ref}
        className={cx(styles.description, className)}
        data-slot="stat-description"
      />
    );
  },
);

export interface StatTrendProps extends ComponentPropsWithoutRef<"span"> {
  direction?: StatTrendDirection;
}

export const StatTrend = forwardRef<HTMLSpanElement, StatTrendProps>(function StatTrend(
  { className, direction = "neutral", ...props },
  ref,
) {
  const { styles } = useStatContext();
  return (
    <span
      {...props}
      ref={ref}
      className={cx(styles.trend, stat({ direction }).trend, className)}
      data-direction={direction}
      data-slot="stat-trend"
    />
  );
});

export const Stat = {
  Root: StatRoot,
  Icon: StatIcon,
  Label: StatLabel,
  Value: StatValue,
  Description: StatDescription,
  Trend: StatTrend,
};

export type StatGroupRootProps = ComponentPropsWithoutRef<"div"> & {
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  responsive?: boolean;
};

export const StatGroupRoot = forwardRef<HTMLDivElement, StatGroupRootProps>(function StatGroupRoot(
  { children, className, columns = 3, gap = "md", responsive = true, style, ...props },
  ref,
) {
  const columnValue = String(columns) as "1" | "2" | "3" | "4";
  return (
    <div
      {...props}
      ref={ref}
      className={cx(statGroup({ columns: columnValue, gap }), className)}
      data-columns={columns}
      data-jaci-component="stat-group"
      data-responsive={responsive || undefined}
      data-slot="stat-group"
      style={
        responsive ? style : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, ...style }
      }
    >
      {children}
    </div>
  );
});

export const StatGroup = { Root: StatGroupRoot };

export type StatGroupProps = StatGroupRootProps;

export type StatChildren = ReactNode;
