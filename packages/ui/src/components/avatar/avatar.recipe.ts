import { defineSlotRecipe } from "@pandacss/dev";

/**
 * Static Panda slot recipe for the avatar composition.
 */
export const avatarRecipe = defineSlotRecipe({
  className: "avatar",
  slots: ["root", "image", "fallback"],
  base: {
    root: {
      alignItems: "center",
      backgroundColor: "surface.subtle",
      borderColor: "border.default",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "1px",
      color: "fg.muted",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      verticalAlign: "middle",
    },
    image: {
      display: "block",
      height: "100%",
      inset: "0",
      objectFit: "cover",
      position: "absolute",
      width: "100%",
    },
    fallback: {
      alignItems: "center",
      display: "inline-flex",
      fontFamily: "system-ui, sans-serif",
      fontWeight: "600",
      height: "100%",
      justifyContent: "center",
      letterSpacing: "0.02em",
      lineHeight: "1",
      textTransform: "uppercase",
      userSelect: "none",
      width: "100%",
    },
  },
  variants: {
    size: {
      xs: {
        root: { height: "6", width: "6" },
        fallback: { fontSize: "xs" },
      },
      sm: {
        root: { height: "8", width: "8" },
        fallback: { fontSize: "sm" },
      },
      md: {
        root: { height: "10", width: "10" },
        fallback: { fontSize: "md" },
      },
      lg: {
        root: { height: "12", width: "12" },
        fallback: { fontSize: "lg" },
      },
      xl: {
        root: { height: "16", width: "16" },
        fallback: { fontSize: "xl" },
      },
    },
    shape: {
      circle: { root: { borderRadius: "full" } },
      rounded: { root: { borderRadius: "xl" } },
    },
  },
  defaultVariants: {
    shape: "circle",
    size: "md",
  },
  staticCss: ["*"],
});
