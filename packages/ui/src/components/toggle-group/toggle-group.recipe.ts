import { defineSlotRecipe } from "@pandacss/dev";

export const toggleGroupRecipe = defineSlotRecipe({
  className: "toggle-group",
  slots: ["root", "item"],
  base: {
    root: {
      alignItems: "center",
      display: "flex",
      gap: "1",
      "&[data-orientation='vertical']": { flexDirection: "column", alignItems: "stretch" },
    },
    item: {
      alignItems: "center",
      appearance: "none",
      backgroundColor: "transparent",
      borderColor: "border.default",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "fg.default",
      cursor: "pointer",
      display: "inline-flex",
      fontWeight: "600",
      justifyContent: "center",
      transitionDuration: "fast",
      transitionProperty: "background-color, border-color, color, opacity",
      transitionTimingFunction: "standard",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
        zIndex: "1",
      },
      _hover: { backgroundColor: "surface.subtle" },
      _disabled: { cursor: "not-allowed", opacity: "0.5" },
      "&[data-pressed]": {
        backgroundColor: "accent.default",
        borderColor: "accent.default",
        color: "fg.onAccent",
        _hover: { backgroundColor: "accent.hover" },
      },
      "&:first-child": { borderStartStartRadius: "md", borderEndStartRadius: "md" },
      "&:last-child": { borderStartEndRadius: "md", borderEndEndRadius: "md" },
      "&:not(:first-child)": { marginInlineStart: "-1px" },
    },
  },
  variants: {
    variant: {
      solid: { item: { "&:not([data-pressed])": { backgroundColor: "surface.default" } } },
      outline: { item: { "&:not([data-pressed])": { backgroundColor: "transparent" } } },
      ghost: {
        item: {
          "&:not([data-pressed])": {
            backgroundColor: "transparent",
            borderColor: "transparent",
          },
        },
      },
    },
    size: {
      sm: { item: { fontSize: "xs", minHeight: "8", paddingInline: "2" } },
      md: { item: { fontSize: "sm", minHeight: "10", paddingInline: "3" } },
      lg: { item: { fontSize: "md", minHeight: "11", paddingInline: "4" } },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
  staticCss: ["*"],
});
