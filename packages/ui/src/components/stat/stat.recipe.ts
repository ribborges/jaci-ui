import { defineSlotRecipe } from "@pandacss/dev";

export const statRecipe = defineSlotRecipe({
  className: "stat",
  slots: ["root", "icon", "label", "value", "description", "trend"],
  base: {
    root: {
      backgroundColor: "surface.raised",
      borderColor: "border.default",
      borderRadius: "xl",
      borderStyle: "solid",
      borderWidth: "1px",
      display: "grid",
      gap: "1",
      minWidth: "0",
      overflow: "hidden",
      p: "4",
    },
    icon: {
      alignItems: "center",
      backgroundColor: "surface.subtle",
      borderRadius: "lg",
      color: "accent.default",
      display: "inline-flex",
      height: "8",
      justifyContent: "center",
      width: "8",
    },
    label: { color: "fg.muted", fontSize: "sm", fontWeight: "600", minWidth: "0" },
    value: {
      color: "fg.default",
      fontSize: { base: "2xl", md: "3xl" },
      fontVariantNumeric: "tabular-nums",
      fontWeight: "700",
      lineHeight: "1.2",
      minWidth: "0",
      overflowWrap: "anywhere",
    },
    description: { color: "fg.muted", fontSize: "sm", minWidth: "0", overflowWrap: "anywhere" },
    trend: { fontSize: "sm", fontWeight: "700", minWidth: "0" },
  },
  variants: {
    tone: {
      neutral: { trend: { color: "fg.muted" } },
      accent: { trend: { color: "accent.default" } },
      success: { trend: { color: "success" } },
      warning: { trend: { color: "warning" } },
      danger: { trend: { color: "danger" } },
    },
    size: {
      sm: { root: { p: "3" }, value: { fontSize: "xl" } },
      md: {},
      lg: { root: { p: "6" }, value: { fontSize: { base: "3xl", md: "4xl" } } },
    },
    direction: {
      up: { trend: { color: "success" } },
      down: { trend: { color: "danger" } },
      neutral: { trend: { color: "fg.muted" } },
    },
  },
  defaultVariants: { size: "md", tone: "neutral", direction: "neutral" },
  staticCss: ["*"],
});
