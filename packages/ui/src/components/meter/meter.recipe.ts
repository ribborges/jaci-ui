import { defineSlotRecipe } from "@pandacss/dev";

export const meterRecipe = defineSlotRecipe({
  className: "meter",
  slots: ["root", "label", "track", "indicator", "value"],
  base: {
    root: { display: "flex", flexDirection: "column", gap: "2", minWidth: "12rem", width: "100%" },
    label: { color: "fg.default", fontSize: "sm", fontWeight: "700" },
    track: {
      backgroundColor: "border.default",
      borderRadius: "full",
      height: "2",
      minHeight: "2",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    indicator: {
      backgroundColor: "fg.muted",
      borderRadius: "full",
      height: "100%",
      insetBlockStart: "0",
      insetInlineStart: "0",
      position: "absolute",
      transitionDuration: "normal",
      transitionProperty: "width, background-color",
      transitionTimingFunction: "standard",
      width: "var(--meter-value, 0%)",
    },
    value: { color: "fg.muted", fontSize: "sm", fontVariantNumeric: "tabular-nums" },
  },
  variants: {
    size: {
      sm: { track: { height: "1", minHeight: "1" } },
      md: { track: { height: "2", minHeight: "2" } },
      lg: { track: { height: "3", minHeight: "3" } },
    },
    tone: {
      neutral: { indicator: { backgroundColor: "fg.muted" } },
      accent: { indicator: { backgroundColor: "accent.default" } },
      success: { indicator: { backgroundColor: "success" } },
      warning: { indicator: { backgroundColor: "warning" } },
      danger: { indicator: { backgroundColor: "danger" } },
    },
  },
  defaultVariants: { size: "md", tone: "accent" },
  staticCss: ["*"],
});
