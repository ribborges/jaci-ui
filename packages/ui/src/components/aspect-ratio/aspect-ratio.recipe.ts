import { defineRecipe } from "@pandacss/dev";

export const aspectRatioRecipe = defineRecipe({
  className: "aspectRatioBox",
  base: {
    boxSizing: "border-box",
    display: "block",
    overflow: "hidden",
    position: "relative",
    width: "100%",
    "& > *": {
      height: "100%",
      inset: "0",
      position: "absolute",
      width: "100%",
    },
  },
  staticCss: ["*"],
});
