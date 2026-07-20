import { createContext, forwardRef, useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { alert } from "../../styled-system/recipes";

export type AlertTone = "info" | "success" | "warning" | "danger";

const AlertToneContext = createContext<AlertTone>("info");

function useAlertStyles() {
  return alert({ tone: useContext(AlertToneContext) });
}

const iconByTone: Record<AlertTone, string> = {
  danger: "!",
  info: "i",
  success: "✓",
  warning: "!",
};

export interface AlertRootProps extends ComponentPropsWithoutRef<"div"> {
  tone?: AlertTone;
}

/**
 * An SSR-safe status message. Informational alerts use a polite live region;
 * warnings and errors default to the assertive `alert` role.
 */
export const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(
  { className, role, tone = "info", ...props },
  ref,
) {
  const styles = alert({ tone });
  const defaultRole = tone === "danger" || tone === "warning" ? "alert" : "status";

  return (
    <AlertToneContext.Provider value={tone}>
      <div
        {...props}
        ref={ref}
        className={cx(styles.root, className)}
        data-jaci-component="alert"
        data-jaci-tone={tone}
        data-slot="alert"
        role={role ?? defaultRole}
      />
    </AlertToneContext.Provider>
  );
});

export type AlertIconProps = ComponentPropsWithoutRef<"span">;

export const AlertIcon = forwardRef<HTMLSpanElement, AlertIconProps>(function AlertIcon(
  { children, className, ...props },
  ref,
) {
  const tone = useContext(AlertToneContext);

  return (
    <span
      {...props}
      aria-hidden="true"
      ref={ref}
      className={cx(useAlertStyles().icon, className)}
      data-slot="alert-icon"
    >
      {children ?? iconByTone[tone]}
    </span>
  );
});

export type AlertTitleProps = ComponentPropsWithoutRef<"div">;

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx(useAlertStyles().title, className)}
      data-slot="alert-title"
    />
  );
});

export type AlertDescriptionProps = ComponentPropsWithoutRef<"div">;

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(useAlertStyles().description, className)}
        data-slot="alert-description"
      />
    );
  },
);

export const Alert = {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
};
