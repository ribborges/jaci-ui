import { defineRecipe } from "@pandacss/dev";

export const toggleRecipe = defineRecipe({
  className: "toggle",
  base: {
    alignItems: "center",
    appearance: "none",
    borderColor: "border.default",
    borderRadius: "md",
    borderStyle: "solid",
    borderWidth: "1px",
    color: "fg.default",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: "600",
    gap: "2",
    justifyContent: "center",
    lineHeight: "1.25",
    transitionDuration: "fast",
    transitionProperty: "background-color, border-color, color, opacity",
    transitionTimingFunction: "standard",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "accent.default",
      outlineOffset: "2px",
    },
    _hover: { backgroundColor: "surface.subtle" },
    _disabled: { cursor: "not-allowed", opacity: "0.5" },
    "&[data-pressed]": {
      backgroundColor: "accent.default",
      borderColor: "accent.default",
      color: "fg.onAccent",
      _hover: { backgroundColor: "accent.hover" },
    },
  },
  variants: {
    variant: {
      solid: {
        "&:not([data-pressed])": { backgroundColor: "surface.default" },
      },
      outline: {
        "&:not([data-pressed])": { backgroundColor: "transparent" },
      },
      ghost: {
        "&:not([data-pressed])": {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
      },
    },
    size: {
      sm: { fontSize: "xs", minHeight: "8", paddingInline: "2" },
      md: { fontSize: "sm", minHeight: "10", paddingInline: "3" },
      lg: { fontSize: "md", minHeight: "11", paddingInline: "4" },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
  staticCss: ["*"],
});
