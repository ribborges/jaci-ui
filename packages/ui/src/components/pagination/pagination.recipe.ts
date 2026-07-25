import { defineSlotRecipe } from "@pandacss/dev";

/** Static Panda slot recipe for navigational pagination controls. */
export const paginationRecipe = defineSlotRecipe({
  className: "pagination",
  slots: ["root", "list", "item", "link", "first", "previous", "next", "last", "ellipsis"],
  base: {
    root: {
      fontFamily: "system-ui, sans-serif",
      maxWidth: "100%",
    },
    list: {
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      gap: { base: "1", md: "2" },
      listStyleType: "none",
      margin: "0",
      padding: "0",
    },
    item: {
      display: "inline-flex",
    },
    link: {
      alignItems: "center",
      backgroundColor: "transparent",
      borderColor: "border.default",
      borderRadius: "lg",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "fg.default",
      display: "inline-flex",
      fontSize: { base: "sm", md: "md" },
      fontWeight: "600",
      gap: "1",
      justifyContent: "center",
      minHeight: { base: "9", md: "10" },
      minWidth: { base: "9", md: "10" },
      px: { base: "2", md: "3" },
      textDecoration: "none",
      transitionDuration: "normal",
      transitionProperty: "background-color, border-color, color, box-shadow",
      transitionTimingFunction: "standard",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      _hover: {
        backgroundColor: "surface.subtle",
        borderColor: "border.strong",
      },
    },
    previous: {},
    next: {},
    first: {},
    last: {},
    ellipsis: {
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      fontSize: { base: "sm", md: "md" },
      fontWeight: "600",
      justifyContent: "center",
      minHeight: { base: "9", md: "10" },
      minWidth: { base: "9", md: "10" },
    },
  },
  variants: {
    density: {
      compact: {
        link: {
          fontSize: "sm",
          minHeight: "8",
          minWidth: "8",
          px: "2",
        },
        ellipsis: { minHeight: "8", minWidth: "8" },
      },
      comfortable: {},
    },
    active: {
      true: {
        link: {
          backgroundColor: "accent.default",
          borderColor: "accent.default",
          color: "fg.onAccent",
          _hover: { backgroundColor: "accent.hover", borderColor: "accent.hover" },
        },
      },
      false: {},
    },
    disabled: {
      true: {
        link: {
          cursor: "not-allowed",
          opacity: "0.5",
          _hover: { backgroundColor: "transparent", borderColor: "border.default" },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    active: false,
    density: "comfortable",
    disabled: false,
  },
  staticCss: ["*"],
});
