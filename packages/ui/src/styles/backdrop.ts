/**
 * Shared backdrop-filter declarations.
 *
 * Vite's production CSS transform keeps only the prefixed declaration when
 * both forms are placed in the same rule. Keep the standard declaration in
 * the base rule and put the WebKit fallback in a feature query so both
 * browser families survive production minification.
 */
export function createBackdropFilterStyles(filter: string) {
  return {
    "--jaci-backdrop-filter": filter as never,
    "--jaci-backdrop-filter-webkit": "var(--jaci-backdrop-filter)" as never,
    "backdrop-filter": "var(--jaci-backdrop-filter)" as never,
    "@supports (-webkit-backdrop-filter: blur(0))": {
      "-webkit-backdrop-filter": "var(--jaci-backdrop-filter-webkit)" as never,
    },
  };
}

export function createBackdropBlurStyles(size: "xs" | "sm" | "md") {
  return createBackdropFilterStyles(`blur(var(--jaci-blurs-${size}))`);
}
