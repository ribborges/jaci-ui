import { defineSlotRecipe } from "@pandacss/dev";

/** The range slider intentionally mirrors Slider's neutral visual language. */
export const rangeSliderRecipe = defineSlotRecipe({
  className: "range-slider",
  slots: ["root", "label", "value", "control", "track", "indicator", "thumb"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "2",
      minWidth: "12rem",
      width: "100%",
    },
    label: { color: "fg.default", fontSize: "sm", fontWeight: "700" },
    value: { color: "fg.muted", fontSize: "sm", fontVariantNumeric: "tabular-nums" },
    control: {
      alignItems: "center",
      display: "flex",
      minHeight: "6",
      touchAction: "none",
      width: "100%",
      _focusWithin: {
        borderRadius: "full",
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "3px",
      },
      "&[data-orientation=vertical]": { minHeight: "12rem", minWidth: "6", width: "auto" },
    },
    track: {
      backgroundColor: "border.default",
      borderRadius: "full",
      position: "relative",
      width: "100%",
      "&[data-orientation=vertical]": { height: "100%", width: "2" },
    },
    indicator: {
      backgroundColor: "accent.default",
      borderRadius: "full",
      position: "absolute",
      "&[data-orientation=horizontal]": {
        height: "100%",
        insetBlockStart: "0",
        insetInlineStart: "0",
      },
      "&[data-orientation=vertical]": { bottom: "0", insetInlineStart: "0", width: "100%" },
    },
    thumb: {
      backgroundColor: "surface.raised",
      borderColor: "accent.default",
      borderRadius: "full",
      borderStyle: "solid",
      borderWidth: "2px",
      boxShadow: "md",
      height: "5",
      width: "5",
      _hover: { boxShadow: "lg" },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "accent.default",
        outlineOffset: "2px",
      },
      _disabled: { cursor: "not-allowed", opacity: "0.55" },
    },
  },
  variants: {
    size: {
      sm: {
        control: { minHeight: "5" },
        track: { height: "1" },
        thumb: { height: "4", width: "4" },
      },
      md: {
        control: { minHeight: "6" },
        track: { height: "2" },
        thumb: { height: "5", width: "5" },
      },
      lg: {
        control: { minHeight: "8" },
        track: { height: "3" },
        thumb: { height: "6", width: "6" },
      },
    },
  },
  defaultVariants: { size: "md" },
  staticCss: ["*"],
});
