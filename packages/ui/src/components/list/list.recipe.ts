import { defineSlotRecipe } from "@pandacss/dev";

export const listRecipe = defineSlotRecipe({
  className: "list",
  slots: ["root", "item", "content", "title", "description", "action"],
  base: {
    root: {
      color: "fg.default",
      display: "flex",
      flexDirection: "column",
      listStylePosition: "inside",
      margin: "0",
      padding: "0",
      "&[data-variant='divided'] > [data-slot='list-item']": {
        borderBottomColor: "border.default",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        borderRadius: "0",
      },
      "&[data-variant='card'] > [data-slot='list-item']": {
        backgroundColor: "surface.raised",
        borderColor: "border.default",
        borderStyle: "solid",
        borderWidth: "1px",
      },
    },
    item: {
      alignItems: "center",
      borderRadius: "lg",
      display: "flex",
      gap: "3",
      minWidth: "0",
      paddingBlock: "3",
      paddingInline: "4",
      transitionDuration: "fast",
      transitionProperty: "background-color, border-color, color, opacity",
      transitionTimingFunction: "standard",
      "&[data-interactive]": { cursor: "pointer" },
      "&[data-selected]": { backgroundColor: "surface.subtle" },
      "&[data-disabled]": { cursor: "not-allowed", opacity: "0.5" },
      _hover: { backgroundColor: "surface.subtle" },
    },
    content: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      minWidth: "0",
    },
    title: {
      color: "fg.default",
      fontWeight: "700",
      lineHeight: "1.4",
    },
    description: {
      color: "fg.muted",
      fontSize: "sm",
      lineHeight: "1.5",
    },
    action: {
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      gap: "2",
    },
  },
  variants: {
    variant: {
      plain: {
        item: { borderBottom: "0" },
      },
      divided: {
        item: {
          borderBottomColor: "border.default",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderRadius: "0",
        },
      },
      card: {
        root: { gap: "2" },
        item: {
          backgroundColor: "surface.raised",
          borderColor: "border.default",
          borderStyle: "solid",
          borderWidth: "1px",
        },
      },
    },
    gap: {
      none: { root: { gap: "0" } },
      sm: { root: { gap: "1" } },
      md: { root: { gap: "2" } },
      lg: { root: { gap: "4" } },
    },
  },
  defaultVariants: { gap: "md", variant: "plain" },
  staticCss: ["*"],
});
