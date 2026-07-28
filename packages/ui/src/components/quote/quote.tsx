import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../../styled-system/css";
import { quote } from "../../styled-system/recipes";

export type QuoteVariant = "default" | "accent" | "subtle";
export type QuoteSize = "sm" | "md" | "lg";

export interface QuoteProps extends ComponentPropsWithoutRef<"blockquote"> {
  /** Visual treatment for the quote surface and leading border. */
  variant?: QuoteVariant;
  /** Typography scale for the quoted content. */
  size?: QuoteSize;
  /** Optional author rendered in a semantic footer. */
  author?: ReactNode;
  /** Optional source rendered as a semantic `<cite>`. */
  source?: ReactNode;
}

/** A semantic blockquote with optional author and source attribution. */
export const Quote = forwardRef<HTMLQuoteElement, QuoteProps>(function Quote(
  { author, children, className, size = "md", source, variant = "default", ...props },
  ref,
) {
  const hasAttribution = author !== undefined || source !== undefined;

  return (
    <blockquote
      {...props}
      ref={ref}
      className={cx(quote({ size, variant }), className)}
      data-jaci-component="quote"
      data-size={size}
      data-slot="quote"
      data-variant={variant}
    >
      <div data-slot="quote-content">{children}</div>
      {hasAttribution ? (
        <footer data-slot="quote-footer">
          {author !== undefined ? <span data-slot="quote-author">{author}</span> : null}
          {source !== undefined ? <cite data-slot="quote-source">{source}</cite> : null}
        </footer>
      ) : null}
    </blockquote>
  );
});
