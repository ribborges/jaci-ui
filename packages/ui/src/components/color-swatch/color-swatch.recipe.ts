import { defineRecipe } from "@pandacss/dev";

export const colorSwatchRecipe = defineRecipe({
  className: "colorSwatch",
  base: {
    display: "inline-block",
    flexShrink: "0",
    overflow: "hidden",
    verticalAlign: "middle",
  },
  variants: {
    size: {
      sm: { height: "4", width: "4" },
      md: { height: "6", width: "6" },
      lg: { height: "8", width: "8" },
    },
    shape: {
      circle: { borderRadius: "full" },
      square: { borderRadius: "md" },
    },
    border: {
      true: { borderColor: "border.default", borderStyle: "solid", borderWidth: "1px" },
      false: {},
    },
  },
  defaultVariants: { size: "md", shape: "circle", border: true },
  staticCss: ["*"],
});
