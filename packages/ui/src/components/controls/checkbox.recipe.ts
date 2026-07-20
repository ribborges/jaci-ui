import { defineSlotRecipe } from "@pandacss/dev";

export const checkboxRecipe = defineSlotRecipe({
  className: "checkbox",
  slots: ["root", "indicator"],
  base: {
    root: {
      alignItems: "center",
      backgroundColor: "transparent",
      borderColor: "border.strong",
      borderRadius: "sm",
      borderStyle: "solid",
      borderWidth: "2px",
      color: "fg.onAccent",
      cursor: "pointer",
      display: "inline-flex",
      height: "5",
      justifyContent: "center",
      width: "5",
      _hover: { borderColor: "accent.default" },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      _disabled: { cursor: "not-allowed", opacity: "0.55" },
      "&[data-checked]": {
        backgroundColor: "accent.default",
        borderColor: "accent.default",
      },
      "&[data-indeterminate]": {
        backgroundColor: "accent.default",
        borderColor: "accent.default",
      },
    },
    indicator: {
      fontSize: "xs",
      fontWeight: "700",
      lineHeight: "1",
    },
  },
  staticCss: ["*"],
});
