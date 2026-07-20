import { defineSlotRecipe } from "@pandacss/dev";

/**
 * Neutral zinc Tooltip slots. The recipe is co-located with its component and
 * registered by the package's Panda configuration during public integration.
 */
export const tooltipRecipe = defineSlotRecipe({
  className: "tooltip",
  slots: ["trigger", "positioner", "popup", "arrow"],
  base: {
    arrow: {
      backgroundColor: "neutral.900",
      height: "2",
      transform: "rotate(45deg)",
      width: "2",
    },
    popup: {
      backgroundColor: "neutral.900",
      borderColor: "neutral.700",
      borderRadius: "md",
      borderStyle: "solid",
      borderWidth: "1px",
      boxShadow: "md",
      color: "fg.onAccent",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      lineHeight: "1.5",
      maxWidth: "20rem",
      px: "3",
      py: "2",
      transitionDuration: "fast",
      transitionProperty: "opacity, transform",
      transitionTimingFunction: "standard",
      "&[data-ending-style]": { opacity: "0", transform: "scale(0.96)" },
      "&[data-starting-style]": { opacity: "0", transform: "scale(0.96)" },
    },
    positioner: {
      outline: "none",
      zIndex: "50",
    },
    trigger: {
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
    },
  },
  staticCss: ["*"],
});
