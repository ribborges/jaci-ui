import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { progress } from "../../styled-system/recipes";

function clamp(value: number, maximum: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), maximum);
}

export interface ProgressProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** The current amount. Omit it, or set `indeterminate`, when it is unknown. */
  value?: number | null;
  /** The value that represents completion. Defaults to 100. */
  max?: number;
  /** Omits `aria-valuenow` and renders an in-progress visual state. */
  indeterminate?: boolean;
  /** A visible, automatically associated accessible label. */
  label?: ReactNode;
}

/**
 * A semantic progress bar. Provide `label` or `aria-label` so its purpose is
 * announced to assistive technology.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-valuetext": ariaValueText,
    className,
    indeterminate = false,
    label,
    max = 100,
    value = 0,
    ...props
  },
  ref,
) {
  const labelId = useId();
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const currentValue = clamp(value ?? 0, maximum);
  const percentage = (currentValue / maximum) * 100;
  const hasVisibleLabel = label !== null && label !== undefined;
  const labelledBy = ariaLabelledBy ?? (ariaLabel || !hasVisibleLabel ? undefined : labelId);
  const accessibleLabel = ariaLabel ?? (labelledBy ? undefined : "Progress");
  const styles = progress({ indeterminate });

  return (
    <div
      {...props}
      ref={ref}
      aria-busy={indeterminate || undefined}
      aria-label={accessibleLabel}
      aria-labelledby={labelledBy}
      aria-valuemax={maximum}
      aria-valuemin={0}
      aria-valuenow={indeterminate ? undefined : currentValue}
      aria-valuetext={ariaValueText}
      className={cx(styles.root, className)}
      data-indeterminate={indeterminate || undefined}
      data-jaci-component="progress"
      data-slot="progress"
      role="progressbar"
    >
      {hasVisibleLabel ? (
        <span className={styles.label} data-slot="progress-label" id={labelId}>
          {label}
        </span>
      ) : null}
      <div aria-hidden="true" className={styles.track} data-slot="progress-track">
        <div
          className={styles.indicator}
          data-indeterminate={indeterminate || undefined}
          data-slot="progress-indicator"
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});
