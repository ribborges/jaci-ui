import { defineRecipe } from "@pandacss/dev";

export const spacerRecipe = defineRecipe({
  className: "spacer",
  base: { flexShrink: "0" },
  variants: {
    axis: {
      horizontal: { height: "1px" },
      vertical: { width: "100%" },
    },
    size: {
      none: {},
      sm: {},
      md: {},
      lg: {},
      xl: {},
    },
  },
  compoundVariants: [
    { axis: "horizontal", size: "none", css: { width: "0" } },
    { axis: "horizontal", size: "sm", css: { width: "2" } },
    { axis: "horizontal", size: "md", css: { width: "4" } },
    { axis: "horizontal", size: "lg", css: { width: "6" } },
    { axis: "horizontal", size: "xl", css: { width: "8" } },
    { axis: "vertical", size: "none", css: { height: "0" } },
    { axis: "vertical", size: "sm", css: { height: "2" } },
    { axis: "vertical", size: "md", css: { height: "4" } },
    { axis: "vertical", size: "lg", css: { height: "6" } },
    { axis: "vertical", size: "xl", css: { height: "8" } },
  ],
  defaultVariants: { axis: "vertical", size: "md" },
  staticCss: ["*"],
});
