import { defineRecipe } from "@pandacss/dev";

/** Base layout for the native form wrapper. */
export const formRecipe = defineRecipe({
  className: "form",
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "6",
    width: "100%",
  },
  staticCss: ["*"],
});
