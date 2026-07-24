import { defineSlotRecipe } from "@pandacss/dev";

export const emptyStateRecipe = defineSlotRecipe({
  className: "emptyState",
  slots: ["root", "icon", "title", "description", "action"],
  base: {
    root: {
      alignItems: "center",
      backgroundColor: "surface.default",
      borderColor: "border.default",
      borderRadius: "2xl",
      borderStyle: "dashed",
      borderWidth: "1px",
      boxSizing: "border-box",
      color: "fg.default",
      display: "flex",
      flexDirection: "column",
      gap: "3",
      justifyContent: "center",
      maxWidth: "100%",
      minHeight: "32",
      p: "8",
      textAlign: "center",
    },
    icon: { color: "fg.muted", fontSize: "2xl", lineHeight: "1" },
    title: { fontSize: "lg", fontWeight: "700" },
    description: { color: "fg.muted", maxWidth: "prose", fontSize: "sm" },
    action: {
      display: "flex",
      gap: "2",
      maxWidth: "100%",
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
  staticCss: ["*"],
});
