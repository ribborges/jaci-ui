import { defineSlotRecipe } from "@pandacss/dev";

export const tableRecipe = defineSlotRecipe({
  className: "table",
  slots: [
    "container",
    "root",
    "caption",
    "header",
    "body",
    "footer",
    "row",
    "head",
    "sortButton",
    "cell",
    "selection",
    "empty",
  ],
  base: {
    container: {
      maxWidth: "100%",
      overflowX: "auto",
      overscrollBehaviorX: "contain",
      width: "100%",
    },
    root: {
      borderCollapse: "collapse",
      color: "fg.default",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      lineHeight: "1.5",
      minWidth: "100%",
      textAlign: "left",
    },
    caption: {
      color: "fg.muted",
      fontSize: "sm",
      fontWeight: "600",
      paddingBlock: "3",
      textAlign: "left",
    },
    header: {
      backgroundColor: "surface.default",
    },
    body: {
      backgroundColor: "surface.raised",
    },
    footer: {
      backgroundColor: "surface.default",
      fontWeight: "600",
    },
    row: {
      borderBottomColor: "border.default",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      transitionDuration: "fast",
      transitionProperty: "background-color, color",
      transitionTimingFunction: "standard",
      "&[data-selected]": { backgroundColor: "surface.subtle" },
      _hover: { backgroundColor: "surface.subtle" },
    },
    head: {
      color: "fg.default",
      fontSize: "xs",
      fontWeight: "700",
      letterSpacing: "0.04em",
      paddingBlock: "3",
      paddingInline: "4",
      textTransform: "uppercase",
      verticalAlign: "middle",
      whiteSpace: "nowrap",
    },
    sortButton: {
      alignItems: "center",
      background: "transparent",
      border: "0",
      borderRadius: "md",
      color: "inherit",
      cursor: "pointer",
      display: "inline-flex",
      font: "inherit",
      gap: "2",
      margin: "-1",
      padding: "1",
      textAlign: "inherit",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      _hover: { color: "accent.default" },
    },
    cell: {
      paddingBlock: "3",
      paddingInline: "4",
      verticalAlign: "middle",
    },
    selection: {
      paddingInline: "3",
      textAlign: "center",
      verticalAlign: "middle",
      width: "12",
    },
    empty: {
      color: "fg.muted",
      padding: "8",
      textAlign: "center",
    },
  },
  variants: {
    density: {
      compact: {
        head: { paddingBlock: "2", paddingInline: "3" },
        cell: { paddingBlock: "2", paddingInline: "3" },
      },
      comfortable: {},
    },
    bordered: {
      true: {
        head: { borderColor: "border.default", borderStyle: "solid", borderWidth: "1px" },
        cell: { borderColor: "border.default", borderStyle: "solid", borderWidth: "1px" },
      },
      false: {},
    },
    striped: {
      true: {
        row: { "&:nth-child(even)": { backgroundColor: "surface.default" } },
      },
      false: {},
    },
    stickyHeader: {
      true: {
        head: { position: "sticky", top: "0", zIndex: "1" },
      },
      false: {},
    },
  },
  defaultVariants: {
    bordered: false,
    density: "comfortable",
    stickyHeader: false,
    striped: false,
  },
  staticCss: ["*"],
});
