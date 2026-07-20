import { defineSlotRecipe } from "@pandacss/dev";

/** Semantic grouping styles shared by related form controls. */
export const fieldsetRecipe = defineSlotRecipe({
  className: "fieldset",
  slots: ["root", "legend", "description"],
  base: {
    root: {
      border: "0",
      display: "flex",
      flexDirection: "column",
      gap: "3",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
      width: "100%",
    },
    legend: {
      color: "fg.default",
      fontFamily: "system-ui, sans-serif",
      fontSize: "md",
      fontWeight: "700",
      marginBlockEnd: "1",
      padding: "0",
    },
    description: {
      color: "fg.muted",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      lineHeight: "1.5",
      margin: "0",
    },
  },
  variants: {
    disabled: {
      true: { root: { opacity: "0.65" } },
      false: {},
    },
  },
  defaultVariants: { disabled: false },
  staticCss: ["*"],
});
