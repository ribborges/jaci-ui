"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { createContext, forwardRef, useContext, useEffect, useId, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, PointerEvent, ReactNode } from "react";
import type { PopoverRoot as BasePopoverRoot } from "@base-ui/react/popover";

import { cx } from "../../styled-system/css";
import { colorPicker } from "../../styled-system/recipes";
import { withRecipeClassName } from "../base-ui";
import { useThemePortalProps } from "../../theme/theme-scope";
import { defaultColor, formatColor, parseColor } from "./color-utils";
import type { ColorFormat, ColorModel } from "./color-utils";

export type { ColorFormat, ColorModel } from "./color-utils";
export { defaultColor, formatColor, parseColor } from "./color-utils";

interface ColorPickerContextValue {
  color: ColorModel;
  disabled: boolean;
  format: ColorFormat;
  inputId: string;
  setColor: (color: ColorModel) => void;
  showAlpha: boolean;
  swatches: string[];
  value: string;
}

const ColorPickerContext = createContext<ColorPickerContextValue | null>(null);

function useColorPicker() {
  const context = useContext(ColorPickerContext);
  if (!context) throw new Error("ColorPicker parts must be rendered inside ColorPicker.Root.");
  return context;
}

export interface ColorPickerRootProps extends Omit<BasePopoverRoot.Props, "children"> {
  children?: ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  format?: ColorFormat;
  id?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  showAlpha?: boolean;
  swatches?: string[];
  value?: string;
}

export function ColorPickerRoot({
  children,
  defaultValue = "#000000",
  disabled = false,
  format = "hex",
  id,
  name,
  onValueChange,
  showAlpha = false,
  swatches = [],
  value: controlledValue,
  ...popoverProps
}: ColorPickerRootProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [uncontrolledColor, setUncontrolledColor] = useState<ColorModel>(() =>
    defaultColor(defaultValue),
  );
  const parsedControlled = parseColor(controlledValue);
  const color = parsedControlled ?? uncontrolledColor;
  const formattedValue = formatColor(color, format, showAlpha);
  const setColor = (nextColor: ColorModel) => {
    setUncontrolledColor(nextColor);
    onValueChange?.(formatColor(nextColor, format, showAlpha));
  };

  return (
    <ColorPickerContext.Provider
      value={{
        color,
        disabled,
        format,
        inputId,
        setColor,
        showAlpha,
        swatches,
        value: formattedValue,
      }}
    >
      <BasePopover.Root {...popoverProps}>
        {children}
        {name ? (
          <input
            aria-hidden="true"
            id={`${inputId}-value`}
            name={name}
            type="hidden"
            value={formattedValue}
          />
        ) : null}
      </BasePopover.Root>
    </ColorPickerContext.Provider>
  );
}

export interface ColorPickerLabelProps extends ComponentPropsWithoutRef<"label"> {}
export const ColorPickerLabel = forwardRef<HTMLLabelElement, ColorPickerLabelProps>(
  function ColorPickerLabel({ children, className, htmlFor, ...props }, ref) {
    const { inputId } = useColorPicker();
    return (
      <label
        {...props}
        ref={ref}
        className={cx(colorPicker().label, className)}
        data-slot="color-picker-label"
        htmlFor={htmlFor ?? inputId}
      >
        {children}
      </label>
    );
  },
);

export type ColorPickerControlProps = ComponentPropsWithoutRef<"div">;
export const ColorPickerControl = forwardRef<HTMLDivElement, ColorPickerControlProps>(
  function ColorPickerControl({ className, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(colorPicker().control, className)}
        data-slot="color-picker-control"
      />
    );
  },
);

export type ColorPickerTriggerProps = ComponentPropsWithoutRef<typeof BasePopover.Trigger>;
export const ColorPickerTrigger = forwardRef<HTMLButtonElement, ColorPickerTriggerProps>(
  function ColorPickerTrigger({ className, disabled, ...props }, ref) {
    const context = useColorPicker();
    return (
      <BasePopover.Trigger
        {...props}
        ref={ref}
        className={withRecipeClassName(colorPicker().trigger, className)}
        data-jaci-component="color-picker"
        data-slot="color-picker-trigger"
        disabled={disabled ?? context.disabled}
        id={props.id ?? context.inputId}
      />
    );
  },
);

export type ColorPickerPreviewProps = ComponentPropsWithoutRef<"span">;
export const ColorPickerPreview = forwardRef<HTMLSpanElement, ColorPickerPreviewProps>(
  function ColorPickerPreview({ className, style, ...props }, ref) {
    const { value } = useColorPicker();
    return (
      <span
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? value}
        className={cx(colorPicker().preview, className)}
        data-slot="color-picker-preview"
        role="img"
        style={{ backgroundColor: value, ...style }}
      />
    );
  },
);

export type ColorPickerValueProps = ComponentPropsWithoutRef<"span">;
export const ColorPickerValue = forwardRef<HTMLSpanElement, ColorPickerValueProps>(
  function ColorPickerValue({ className, ...props }, ref) {
    const { value } = useColorPicker();
    return (
      <span
        {...props}
        ref={ref}
        className={cx(colorPicker().value, className)}
        data-slot="color-picker-value"
      >
        {props.children ?? value}
      </span>
    );
  },
);

export function ColorPickerPortal(props: ComponentPropsWithoutRef<typeof BasePopover.Portal>) {
  return <BasePopover.Portal {...useThemePortalProps(props)} />;
}
export type ColorPickerPositionerProps = ComponentPropsWithoutRef<typeof BasePopover.Positioner>;
export const ColorPickerPositioner = forwardRef<HTMLDivElement, ColorPickerPositionerProps>(
  function ColorPickerPositioner({ className, ...props }, ref) {
    return (
      <BasePopover.Positioner
        {...props}
        ref={ref}
        className={withRecipeClassName(colorPicker().positioner, className)}
        data-slot="color-picker-positioner"
      />
    );
  },
);

export type ColorPickerPopupProps = ComponentPropsWithoutRef<typeof BasePopover.Popup>;
export const ColorPickerPopup = forwardRef<HTMLDivElement, ColorPickerPopupProps>(
  function ColorPickerPopup({ className, ...props }, ref) {
    return (
      <BasePopover.Popup
        {...props}
        aria-label={props["aria-label"] ?? "Color picker"}
        ref={ref}
        className={withRecipeClassName(colorPicker().popup, className)}
        data-jaci-component="color-picker"
        data-slot="color-picker-popup"
      />
    );
  },
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatPalettePercentage(value: number) {
  return `${Number(value.toFixed(2))}%`;
}

function hslToPalettePosition(color: ColorModel) {
  const lightness = clamp(color.lightness / 100, 0, 1);
  const saturation = clamp(color.saturation / 100, 0, 1);
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const value = lightness + chroma / 2;

  return {
    lightness: (1 - value) * 100,
    saturation: value === 0 ? 0 : (chroma / value) * 100,
  };
}

function palettePositionToHsl(
  saturation: number,
  lightness: number,
  color: ColorModel,
): ColorModel {
  const hsvSaturation = clamp(saturation / 100, 0, 1);
  const value = 1 - clamp(lightness / 100, 0, 1);
  const hslLightness = value * (1 - hsvSaturation / 2);
  const hslSaturation =
    hslLightness === 0 || hslLightness === 1
      ? 0
      : ((value - hslLightness) / Math.min(hslLightness, 1 - hslLightness)) * 100;

  return {
    ...color,
    lightness: hslLightness * 100,
    saturation: clamp(hslSaturation, 0, 100),
  };
}

function updateFromPoint(
  event: PointerEvent<HTMLDivElement>,
  setColor: (color: ColorModel) => void,
  color: ColorModel,
) {
  const rect = event.currentTarget.getBoundingClientRect();
  const saturation = Math.round(clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100);
  const lightness = Math.round(clamp((event.clientY - rect.top) / rect.height, 0, 1) * 100);
  setColor(palettePositionToHsl(saturation, lightness, color));
}

export type ColorPickerPaletteProps = Omit<ComponentPropsWithoutRef<"div">, "onChange">;
export const ColorPickerPalette = forwardRef<HTMLDivElement, ColorPickerPaletteProps>(
  function ColorPickerPalette(
    {
      children,
      className,
      onKeyDown,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      style,
      ...props
    },
    ref,
  ) {
    const { color, disabled, setColor, value } = useColorPicker();
    const [isDragging, setIsDragging] = useState(false);
    const background = `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${color.hue} 100% 50%))`;
    const palettePosition = hslToPalettePosition(color);
    const paletteStyle = {
      "--jaci-color-palette-lightness": formatPalettePercentage(palettePosition.lightness),
      "--jaci-color-palette-saturation": formatPalettePercentage(palettePosition.saturation),
      background,
      ...style,
    } as CSSProperties;

    const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
    };

    return (
      <div
        {...props}
        ref={ref}
        aria-disabled={disabled || undefined}
        aria-label={props["aria-label"] ?? "Color saturation and lightness"}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(palettePosition.saturation)}
        aria-valuetext={value}
        className={cx(colorPicker().palette, className)}
        data-disabled={disabled || undefined}
        data-dragging={isDragging || undefined}
        data-slot="color-picker-palette"
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 1;
          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown"
          ) {
            event.preventDefault();
            const saturation =
              event.key === "ArrowLeft"
                ? Math.max(0, palettePosition.saturation - step)
                : event.key === "ArrowRight"
                  ? Math.min(100, palettePosition.saturation + step)
                  : palettePosition.saturation;
            const lightness =
              event.key === "ArrowDown"
                ? Math.min(100, palettePosition.lightness + step)
                : event.key === "ArrowUp"
                  ? Math.max(0, palettePosition.lightness - step)
                  : palettePosition.lightness;
            setColor(palettePositionToHsl(saturation, lightness, color));
          }
          onKeyDown?.(event);
        }}
        onPointerDown={(event) => {
          if (!disabled) {
            updateFromPoint(event, setColor, color);
            setIsDragging(true);
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // Pointer capture is not available in every test environment.
            }
          }
          onPointerDown?.(event);
        }}
        onPointerMove={(event) => {
          if (!disabled && isDragging) updateFromPoint(event, setColor, color);
          onPointerMove?.(event);
        }}
        onPointerUp={(event) => {
          releasePointer(event);
          onPointerUp?.(event);
        }}
        onPointerCancel={(event) => {
          releasePointer(event);
          onPointerCancel?.(event);
        }}
        role="slider"
        style={paletteStyle}
        tabIndex={props.tabIndex ?? (disabled ? -1 : 0)}
      >
        <span
          aria-hidden="true"
          className={colorPicker().paletteIndicator}
          data-slot="color-picker-palette-indicator"
        />
        {children}
      </div>
    );
  },
);

export type ColorPickerHueProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "max" | "min" | "onChange" | "step" | "type" | "value"
>;
export const ColorPickerHue = forwardRef<HTMLInputElement, ColorPickerHueProps>(
  function ColorPickerHue({ className, onInput, ...props }, ref) {
    const { color, setColor } = useColorPicker();
    return (
      <input
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Hue"}
        className={cx(colorPicker().hue, className)}
        data-slot="color-picker-hue"
        max={360}
        min={0}
        onInput={(event) => {
          setColor({ ...color, hue: Number(event.currentTarget.value) });
          onInput?.(event);
        }}
        step={1}
        type="range"
        value={color.hue}
      />
    );
  },
);

export type ColorPickerAlphaProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "max" | "min" | "onChange" | "step" | "type" | "value"
>;
export const ColorPickerAlpha = forwardRef<HTMLInputElement, ColorPickerAlphaProps>(
  function ColorPickerAlpha({ className, onInput, style, ...props }, ref) {
    const { color, setColor, showAlpha } = useColorPicker();
    if (!showAlpha) return null;
    return (
      <input
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Opacity"}
        className={cx(colorPicker().alpha, className)}
        data-slot="color-picker-alpha"
        max={1}
        min={0}
        onInput={(event) => {
          setColor({ ...color, alpha: Number(event.currentTarget.value) });
          onInput?.(event);
        }}
        step={0.01}
        style={{
          ...style,
          background: `linear-gradient(to right, transparent, ${formatColor({ ...color, alpha: 1 }, "rgb")})`,
        }}
        type="range"
        value={color.alpha}
      />
    );
  },
);

export type ColorPickerSwatchesProps = ComponentPropsWithoutRef<"fieldset">;
export const ColorPickerSwatches = forwardRef<HTMLFieldSetElement, ColorPickerSwatchesProps>(
  function ColorPickerSwatches({ children, className, ...props }, ref) {
    const { swatches } = useColorPicker();
    return (
      <fieldset
        {...props}
        ref={ref}
        className={cx(colorPicker().swatches, className)}
        data-slot="color-picker-swatches"
      >
        {children ?? swatches.map((color) => <ColorPickerSwatch color={color} key={color} />)}
      </fieldset>
    );
  },
);

export interface ColorPickerSwatchProps extends ComponentPropsWithoutRef<"button"> {
  color: string;
}
export const ColorPickerSwatch = forwardRef<HTMLButtonElement, ColorPickerSwatchProps>(
  function ColorPickerSwatch({ children, className, color, style, ...props }, ref) {
    const context = useColorPicker();
    const parsed = parseColor(color);
    const selected =
      parsed && formatColor(parsed, context.format, context.showAlpha) === context.value;
    return (
      <button
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? color}
        aria-pressed={selected || undefined}
        className={cx(colorPicker().swatch, className)}
        data-selected={selected || undefined}
        data-slot="color-picker-swatch"
        onClick={(event) => {
          if (parsed) context.setColor(parsed);
          props.onClick?.(event);
        }}
        style={{ backgroundColor: color, ...style }}
        type="button"
      >
        {children}
      </button>
    );
  },
);

export type ColorPickerInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange" | "type" | "value"
>;
export const ColorPickerInput = forwardRef<HTMLInputElement, ColorPickerInputProps>(
  function ColorPickerInput({ className, onBlur, onKeyDown, ...props }, ref) {
    const { format, setColor, showAlpha, value } = useColorPicker();
    const [draft, setDraft] = useState(value);
    const [invalid, setInvalid] = useState(false);
    useEffect(() => setDraft(value), [value]);
    const commit = () => {
      const parsed = parseColor(draft);
      if (!parsed) {
        setInvalid(true);
        setDraft(value);
        return;
      }
      setInvalid(false);
      setColor(parsed);
      setDraft(formatColor(parsed, format, showAlpha));
    };
    return (
      <input
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Color value"}
        aria-invalid={invalid || undefined}
        className={cx(colorPicker().input, className)}
        data-slot="color-picker-input"
        onBlur={(event) => {
          commit();
          onBlur?.(event);
        }}
        onChange={(event) => {
          setDraft(event.currentTarget.value);
          setInvalid(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
          onKeyDown?.(event);
        }}
        type="text"
        value={draft}
      />
    );
  },
);

export type ColorPickerNativeInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "onChange" | "type" | "value"
>;
export const ColorPickerNativeInput = forwardRef<HTMLInputElement, ColorPickerNativeInputProps>(
  function ColorPickerNativeInput({ className, onInput, ...props }, ref) {
    const { color, setColor, showAlpha } = useColorPicker();
    const value = formatColor({ ...color, alpha: 1 }, "hex");
    return (
      <input
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Choose a color"}
        className={cx(colorPicker().nativeInput, className)}
        data-slot="color-picker-native-input"
        onInput={(event) => {
          const parsed = parseColor(event.currentTarget.value);
          if (parsed) setColor({ ...parsed, alpha: showAlpha ? color.alpha : 1 });
          onInput?.(event);
        }}
        type="color"
        value={value.slice(0, 7)}
      />
    );
  },
);

export const ColorPicker = {
  Root: ColorPickerRoot,
  Label: ColorPickerLabel,
  Control: ColorPickerControl,
  Trigger: ColorPickerTrigger,
  Preview: ColorPickerPreview,
  Value: ColorPickerValue,
  Portal: ColorPickerPortal,
  Positioner: ColorPickerPositioner,
  Popup: ColorPickerPopup,
  Palette: ColorPickerPalette,
  Hue: ColorPickerHue,
  Alpha: ColorPickerAlpha,
  Swatches: ColorPickerSwatches,
  Swatch: ColorPickerSwatch,
  Input: ColorPickerInput,
  NativeInput: ColorPickerNativeInput,
  createHandle: BasePopover.createHandle,
};
