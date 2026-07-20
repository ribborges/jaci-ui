import { defineSlotRecipe } from "@pandacss/dev";

/** Visual treatment for the custom single/multiple option selector. */
export const optionSelectorRecipe = defineSlotRecipe({
  className: "option-selector",
  slots: [
    "root",
    "legend",
    "icon",
    "label",
    "description",
    "options",
    "option",
    "input",
    "content",
    "optionLabel",
  ],
  base: {
    root: {
      border: "0",
      display: "flex",
      flexDirection: "column",
      gap: "2",
      margin: "0",
      minInlineSize: "0",
      padding: "0",
      width: "100%",
    },
    legend: {
      alignItems: "center",
      color: "fg.default",
      display: "flex",
      fontFamily: "system-ui, sans-serif",
      fontSize: "md",
      fontWeight: "700",
      gap: "2",
      padding: "0",
    },
    icon: {
      color: "accent.default",
      display: "inline-flex",
      fontSize: "lg",
      lineHeight: "1",
    },
    label: {},
    description: {
      color: "fg.muted",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      lineHeight: "1.5",
      margin: "0",
    },
    options: {
      display: "grid",
      gap: "4",
      overflowX: "auto",
      padding: "4",
      scrollbarWidth: "thin",
    },
    option: {
      alignItems: "center",
      backgroundColor: "surface.raised",
      borderColor: "border.default",
      borderRadius: "lg",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "fg.default",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      gap: "2",
      justifyContent: "center",
      minWidth: "0",
      outline: "none",
      p: "6",
      textAlign: "center",
      transitionDuration: "slow",
      transitionProperty: "background-color, border-color, box-shadow, color, opacity",
      transitionTimingFunction: "standard",
      _hover: {
        borderColor: "border.strong",
        opacity: "0.72",
      },
      "&:has(input:focus-visible)": {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      "&[data-selected='true']": {
        backgroundColor: "surface.subtle",
        borderColor: "accent.default",
        color: "fg.default",
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: "0.55",
      },
    },
    input: {
      height: "1px",
      opacity: "0",
      overflow: "hidden",
      position: "absolute",
      width: "1px",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap",
    },
    content: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: "2",
      minWidth: "0",
      width: "100%",
    },
    optionLabel: {
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      fontWeight: "600",
      lineHeight: "1.5",
    },
  },
  variants: {
    orientation: {
      horizontal: {
        options: {
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(min(12rem, 70vw), 1fr)",
          gridTemplateRows: "1fr",
          minWidth: "max-content",
        },
      },
      vertical: {
        options: {
          gridTemplateColumns: "1fr",
        },
      },
    },
    columns: {
      1: { options: { gridTemplateColumns: "repeat(1, minmax(0, 1fr))" } },
      2: {
        options: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            md: "repeat(2, minmax(0, 1fr))",
          },
        },
      },
      3: {
        options: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            md: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
        },
      },
      4: {
        options: {
          gridTemplateColumns: {
            base: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        },
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    columns: 1,
  },
  staticCss: ["*"],
});
