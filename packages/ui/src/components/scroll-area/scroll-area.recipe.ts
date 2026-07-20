import { defineSlotRecipe } from "@pandacss/dev";

export const scrollAreaRecipe = defineSlotRecipe({
  className: "scroll-area",
  slots: ["root", "viewport", "content", "scrollbar", "thumb", "corner"],
  base: {
    root: {
      backgroundColor: "surface.raised",
      borderRadius: "md",
      minHeight: "0",
      minWidth: "0",
      overflow: "hidden",
      position: "relative",
    },
    viewport: {
      height: "100%",
      minHeight: "0",
      minWidth: "0",
      overflow: "auto",
      width: "100%",
    },
    content: {
      minHeight: "100%",
      minWidth: "100%",
      padding: "1",
    },
    scrollbar: {
      backgroundColor: "surface.default",
      display: "flex",
      padding: "1",
      touchAction: "none",
      userSelect: "none",
      "&[data-orientation='vertical']": { flexDirection: "column", width: "0.75rem" },
      "&[data-orientation='horizontal']": { flexDirection: "row", height: "0.75rem" },
    },
    thumb: {
      backgroundColor: "border.strong",
      borderRadius: "full",
      flex: "1",
      position: "relative",
      _hover: { backgroundColor: "fg.muted" },
      "&[data-orientation='vertical']": { minHeight: "2rem", width: "100%" },
      "&[data-orientation='horizontal']": { height: "100%", minWidth: "2rem" },
    },
    corner: { backgroundColor: "surface.default" },
  },
  staticCss: ["*"],
});
