import { defineSlotRecipe } from "@pandacss/dev";

/** Static Panda slot recipe for the breadcrumb composition. */
export const breadcrumbsRecipe = defineSlotRecipe({
  className: "breadcrumbs",
  slots: ["root", "list", "item", "link", "current", "separator"],
  base: {
    root: {
      color: "fg.muted",
      fontFamily: "system-ui, sans-serif",
      maxWidth: "100%",
    },
    list: {
      alignItems: "center",
      display: "flex",
      gap: "1",
      listStyleType: "none",
      margin: "0",
      maxWidth: "100%",
      overflowX: "auto",
      padding: "0",
      whiteSpace: "nowrap",
    },
    item: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      minWidth: "0",
    },
    link: {
      borderRadius: "sm",
      color: "fg.muted",
      display: "inline-flex",
      fontSize: { base: "sm", md: "md" },
      maxWidth: { base: "40", md: "56" },
      overflow: "hidden",
      textDecoration: "none",
      textOverflow: "ellipsis",
      transitionDuration: "normal",
      transitionProperty: "color, background-color",
      transitionTimingFunction: "standard",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      _hover: { color: "fg.default", textDecoration: "underline" },
    },
    current: {
      color: "fg.default",
      fontSize: { base: "sm", md: "md" },
      fontWeight: "600",
      maxWidth: { base: "40", md: "56" },
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    separator: {
      color: "fg.muted",
      display: "inline-flex",
      fontSize: "sm",
      px: "1",
      userSelect: "none",
    },
  },
  staticCss: ["*"],
});
