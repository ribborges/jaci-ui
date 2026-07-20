import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { cx } from "../../styled-system/css";
import { card } from "../../styled-system/recipes";

export interface CardProps extends ComponentPropsWithoutRef<"article"> {
  variant?: "outline" | "elevated" | "subtle";
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { className, variant = "outline", ...props },
  ref,
) {
  const styles = card({ variant });

  return (
    <article
      {...props}
      ref={ref}
      className={cx(styles.root, className)}
      data-jaci-component="card"
      data-slot="card"
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cx(card().header, className)} data-slot="card-header" />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<"h3">>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3 {...props} ref={ref} className={cx(card().title, className)} data-slot="card-title" />
    );
  },
);

export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(card().content, className)}
        data-slot="card-content"
      />
    );
  },
);

export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cx(card().footer, className)} data-slot="card-footer" />
    );
  },
);
