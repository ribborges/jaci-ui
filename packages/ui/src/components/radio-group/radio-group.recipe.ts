import { defineSlotRecipe } from "@pandacss/dev";

export const radioGroupRecipe = defineSlotRecipe({
  className: "radio-group",
  slots: ["root", "label", "options", "option", "radio", "indicator"],
  base: {
    root: { display: "flex", flexDirection: "column", gap: "3", width: "100%" },
    label: { color: "fg.default", fontSize: "sm", fontWeight: "700", lineHeight: "1.5" },
    options: { display: "flex", flexDirection: "column", gap: "2" },
    option: {
      alignItems: "center",
      color: "fg.default",
      cursor: "pointer",
      display: "inline-flex",
      fontSize: "sm",
      gap: "2",
      width: "fit-content",
      _disabled: { cursor: "not-allowed", opacity: "0.5" },
    },
    radio: {
      alignItems: "center",
      appearance: "none",
      backgroundColor: "transparent",
      backgroundImage: "none",
      borderColor: "border.strong",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "2px",
      display: "inline-flex",
      flexShrink: "0",
      height: "5",
      justifyContent: "center",
      width: "5",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      "&[data-checked]": { borderColor: "accent.default" },
      "&:checked": {
        backgroundImage:
          "radial-gradient(circle, var(--jaci-colors-accent-default) 0 35%, transparent 40%)",
        borderColor: "accent.default",
      },
      "&[data-disabled]": { cursor: "not-allowed", opacity: "0.5" },
      "&:disabled": { cursor: "not-allowed", opacity: "0.5" },
    },
    indicator: {
      backgroundColor: "accent.default",
      borderRadius: "full",
      height: "2",
      width: "2",
    },
  },
  staticCss: ["*"],
});
