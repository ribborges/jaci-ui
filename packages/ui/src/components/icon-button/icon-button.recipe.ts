import { defineRecipe } from "@pandacss/dev";

export const iconButtonRecipe = defineRecipe({
  className: "iconButton",
  base: {
    alignItems: "center",
    borderColor: "border.interactive",
    borderRadius: "lg",
    borderStyle: "solid",
    borderWidth: "1px",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: "0",
    justifyContent: "center",
    maxWidth: "100%",
    overflow: "hidden",
    transitionDuration: "fast",
    transitionProperty: "background-color, border-color, box-shadow, color, transform",
    transitionTimingFunction: "standard",
    _disabled: { cursor: "not-allowed", opacity: "0.5" },
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "focus",
      outlineOffset: "2px",
    },
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: "accent.default",
        borderColor: "accent.default",
        color: "fg.onAccent",
        _hover: { backgroundColor: "accent.hover", borderColor: "accent.hover" },
      },
      outline: {
        backgroundColor: "transparent",
        color: "fg.default",
        _hover: { backgroundColor: "surface.subtle", borderColor: "border.strong" },
      },
      ghost: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: "fg.default",
        _hover: { backgroundColor: "surface.subtle" },
      },
      danger: {
        backgroundColor: "danger",
        borderColor: "danger",
        color: "fg.onAccent",
        _hover: { opacity: "0.9" },
      },
    },
    size: {
      sm: { fontSize: "sm", height: "9", width: "9" },
      md: { fontSize: "md", height: "10", width: "10" },
      lg: { fontSize: "lg", height: "12", width: "12" },
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
  staticCss: ["*"],
});
