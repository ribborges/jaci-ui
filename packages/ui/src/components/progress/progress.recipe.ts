import { defineKeyframes, defineSlotRecipe } from "@pandacss/dev";

export const progressKeyframes = defineKeyframes({
  jaciProgressIndeterminate: {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(250%)" },
  },
});

export const progressRecipe = defineSlotRecipe({
  className: "progress",
  slots: ["root", "label", "value", "track", "indicator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "2",
      width: "100%",
    },
    label: {
      color: "fg.default",
      fontFamily: "system-ui, sans-serif",
      fontSize: "sm",
      fontWeight: "600",
      lineHeight: "1.5",
    },
    value: {
      color: "fg.muted",
      fontSize: "sm",
      fontVariantNumeric: "tabular-nums",
      marginInlineStart: "auto",
    },
    track: {
      backgroundColor: "surface.subtle",
      borderRadius: "full",
      height: "2",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    indicator: {
      backgroundColor: "accent.default",
      borderRadius: "inherit",
      height: "100%",
      minWidth: "0",
      transitionDuration: "normal",
      transitionProperty: "transform, width",
      transitionTimingFunction: "standard",
    },
  },
  variants: {
    indeterminate: {
      true: {
        indicator: {
          _motionReduce: { animation: "none", transform: "translateX(0)" },
          animation: "jaciProgressIndeterminate 1.25s cubic-bezier(0.2, 0, 0, 1) infinite",
          width: "40%",
        },
      },
    },
  },
  defaultVariants: {
    indeterminate: false,
  },
  staticCss: ["*"],
});
