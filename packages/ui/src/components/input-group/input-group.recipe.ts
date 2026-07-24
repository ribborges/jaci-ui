import { defineSlotRecipe } from "@pandacss/dev";

export const inputGroupRecipe = defineSlotRecipe({
  className: "inputGroup",
  slots: ["root", "addon"],
  base: {
    root: {
      alignItems: "stretch",
      display: "flex",
      minWidth: "0",
      width: "100%",
      "& > [data-slot=input]": { flex: "1", minWidth: "0" },
    },
    addon: {
      alignItems: "center",
      backgroundColor: "surface.subtle",
      borderColor: "border.default",
      borderStyle: "solid",
      borderWidth: "2px",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      fontSize: "sm",
      maxWidth: "50%",
      overflow: "hidden",
      px: "3",
      whiteSpace: "nowrap",
    },
  },
  staticCss: ["*"],
});
