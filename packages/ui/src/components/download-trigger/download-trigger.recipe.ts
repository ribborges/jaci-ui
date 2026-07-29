import { defineRecipe } from "@pandacss/dev";

export const downloadTriggerRecipe = defineRecipe({
  className: "downloadTrigger",
  base: {
    alignItems: "center",
    borderRadius: "md",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: "medium",
    gap: "2",
    justifyContent: "center",
    maxWidth: "100%",
    minWidth: "0",
    overflowWrap: "anywhere",
    textDecoration: "none",
    transitionDuration: "fast",
    transitionProperty: "standard",
    transitionTimingFunction: "standard",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "focus.ring",
      outlineOffset: "2px",
    },
    _disabled: { cursor: "not-allowed", opacity: "0.6", pointerEvents: "none" },
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: "accent.default",
        color: "fg.onAccent",
        _hover: { backgroundColor: "accent.hover" },
      },
      outline: {
        borderColor: "border.default",
        borderStyle: "solid",
        borderWidth: "1px",
        color: "fg.default",
        _hover: { backgroundColor: "surface.subtle" },
      },
      ghost: { color: "fg.default", _hover: { backgroundColor: "surface.subtle" } },
    },
    size: {
      sm: { minHeight: "8", paddingInline: "3", fontSize: "sm" },
      md: { minHeight: "10", paddingInline: "4", fontSize: "sm" },
      lg: { minHeight: "12", paddingInline: "5", fontSize: "md" },
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
  staticCss: ["*"],
});
