import { defineSlotRecipe } from "@pandacss/dev";

export const alertRecipe = defineSlotRecipe({
  className: "alert",
  slots: ["root", "icon", "title", "description"],
  base: {
    root: {
      alignItems: "start",
      backgroundColor: "surface.raised",
      borderColor: "border.default",
      borderRadius: "xl",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "fg.default",
      columnGap: "3",
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr)",
      p: "4",
    },
    icon: {
      alignItems: "center",
      borderRadius: "full",
      display: "inline-flex",
      fontFamily: "system-ui, sans-serif",
      fontSize: "lg",
      fontWeight: "700",
      gridRow: "1 / span 2",
      height: "6",
      justifyContent: "center",
      lineHeight: "1",
      width: "6",
    },
    title: {
      color: "fg.default",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      fontWeight: "700",
      lineHeight: "1.5",
      minWidth: "0",
    },
    description: {
      color: "fg.muted",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      gridColumn: "2",
      lineHeight: "1.5",
      minWidth: "0",
      mt: "1",
    },
  },
  variants: {
    tone: {
      info: {
        root: { borderColor: "accent.default" },
        icon: { backgroundColor: "accent.default", color: "fg.onAccent" },
      },
      success: {
        root: { borderColor: "success" },
        icon: { backgroundColor: "success", color: "fg.onAccent" },
      },
      warning: {
        root: { borderColor: "warning" },
        icon: { backgroundColor: "warning", color: "fg.onAccent" },
      },
      danger: {
        root: { borderColor: "danger" },
        icon: { backgroundColor: "danger", color: "fg.onAccent" },
      },
    },
  },
  defaultVariants: {
    tone: "info",
  },
  staticCss: ["*"],
});
