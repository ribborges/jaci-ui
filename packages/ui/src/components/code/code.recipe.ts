import { defineRecipe } from "@pandacss/dev";

export const codeRecipe = defineRecipe({
  className: "code",
  base: {
    backgroundColor: "surface.subtle",
    borderColor: "border.default",
    borderRadius: "md",
    borderStyle: "solid",
    borderWidth: "1px",
    color: "fg.default",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "sm",
    maxWidth: "100%",
  },
  variants: {
    variant: {
      inline: { display: "inline", px: "1", py: "0.5" },
      block: { display: "block", overflowX: "auto", p: "4", whiteSpace: "pre" },
    },
    wrap: {
      true: { whiteSpace: "pre-wrap", overflowWrap: "anywhere" },
      false: {},
    },
    truncate: {
      true: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      false: {},
    },
    lineNumbers: {
      true: {
        "&[data-line-numbers='true']": {
          columnGap: "3",
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr)",
        },
        "&[data-line-numbers='true'] [data-slot='code-gutter']": {
          color: "fg.muted",
          display: "flex",
          flexDirection: "column",
          minWidth: "3ch",
          textAlign: "end",
          userSelect: "none",
        },
        "&[data-line-numbers='true'] [data-slot='code-content']": {
          minWidth: "0",
        },
      },
      false: {},
    },
  },
  defaultVariants: { variant: "inline", wrap: false, truncate: false, lineNumbers: false },
  staticCss: ["*"],
});
