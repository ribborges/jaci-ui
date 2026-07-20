import { defineKeyframes, defineRecipe } from "@pandacss/dev";

/** Register this in Panda's `theme.extend.keyframes` during integration. */
export const skeletonKeyframes = defineKeyframes({
  jaciSkeletonPulse: {
    "0%, 100%": { opacity: "0.55" },
    "50%": { opacity: "1" },
  },
});

export const skeletonRecipe = defineRecipe({
  className: "skeleton",
  base: {
    backgroundColor: "surface.subtle",
    display: "block",
    overflow: "hidden",
    _motionReduce: { animation: "none" },
  },
  variants: {
    variant: {
      text: {
        borderRadius: "sm",
        height: "1em",
        width: "100%",
      },
      circle: {
        aspectRatio: "1",
        borderRadius: "full",
        width: "10",
      },
      rect: {
        borderRadius: "lg",
        minHeight: "24",
        width: "100%",
      },
    },
    animated: {
      true: {
        animation: "jaciSkeletonPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      false: {},
    },
  },
  defaultVariants: {
    animated: true,
    variant: "rect",
  },
  staticCss: ["*"],
});
