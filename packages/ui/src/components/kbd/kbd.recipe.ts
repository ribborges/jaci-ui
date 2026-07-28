import { defineRecipe } from "@pandacss/dev";

export const kbdRecipe = defineRecipe({
  className: "kbd",
  base: {
    alignItems: "center",
    borderRadius: "md",
    display: "inline-flex",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontWeight: "600",
    justifyContent: "center",
    lineHeight: "1",
    whiteSpace: "nowrap",
  },
  variants: {
    size: {
      sm: { fontSize: "xs", minHeight: "5", px: "1.5" },
      md: { fontSize: "sm", minHeight: "6", px: "2" },
      lg: { fontSize: "md", minHeight: "8", px: "2.5" },
    },
    variant: {
      solid: { backgroundColor: "fg.default", color: "surface.canvas" },
      outline: {
        borderColor: "border.strong",
        borderStyle: "solid",
        borderWidth: "1px",
        color: "fg.default",
      },
      subtle: { backgroundColor: "surface.subtle", color: "fg.default" },
    },
  },
  defaultVariants: { size: "md", variant: "subtle" },
  staticCss: ["*"],
});
