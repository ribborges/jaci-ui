import { defineRecipe } from "@pandacss/dev";

export const qrCodeRecipe = defineRecipe({
  className: "qrCode",
  base: {
    backgroundColor: "surface.raised",
    borderRadius: "lg",
    display: "block",
    maxWidth: "100%",
    overflow: "hidden",
    padding: "2",
  },
  staticCss: ["*"],
});
