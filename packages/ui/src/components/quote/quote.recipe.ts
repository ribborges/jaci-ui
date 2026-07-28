import { defineRecipe } from "@pandacss/dev";

export const quoteRecipe = defineRecipe({
  className: "quote",
  base: {
    boxSizing: "border-box",
    borderInlineStart: "4px solid",
    color: "fg.default",
    display: "grid",
    gap: "3",
    marginInline: "0",
    maxWidth: "100%",
    minWidth: "0",
    overflowWrap: "anywhere",
    paddingBlock: "3",
    paddingInlineEnd: "4",
    paddingInlineStart: "5",
    fontStyle: "italic",
    lineHeight: "1.6",
    "& > [data-slot='quote-footer']": {
      alignItems: "baseline",
      color: "fg.muted",
      display: "flex",
      flexWrap: "wrap",
      fontSize: "sm",
      fontStyle: "normal",
      gap: "2",
      minWidth: "0",
    },
    "& > [data-slot='quote-author']": {
      fontWeight: "600",
    },
    "& > [data-slot='quote-source']": {
      overflowWrap: "anywhere",
    },
  },
  variants: {
    variant: {
      default: {
        backgroundColor: "surface.raised",
        borderColor: "border.default",
      },
      accent: {
        backgroundColor: "selected",
        borderColor: "accent.default",
      },
      subtle: {
        backgroundColor: "surface.subtle",
        borderColor: "border.strong",
      },
    },
    size: {
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
    },
  },
  defaultVariants: { size: "md", variant: "default" },
  staticCss: ["*"],
});
