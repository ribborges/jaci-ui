import { defineSlotRecipe } from "@pandacss/dev";

export const buttonGroupRecipe = defineSlotRecipe({
  className: "buttonGroup",
  slots: ["root"],
  base: {
    root: {
      alignItems: "center",
      display: "inline-flex",
      maxWidth: "100%",
    },
  },
  variants: {
    orientation: {
      horizontal: { root: { flexDirection: "row", flexWrap: "wrap", gap: "2" } },
      vertical: { root: { flexDirection: "column", alignItems: "stretch", gap: "2" } },
    },
  },
  defaultVariants: { orientation: "horizontal" },
  staticCss: ["*"],
});
