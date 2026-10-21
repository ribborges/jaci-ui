// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function renderPalette() {
  const container = renderInDocument(
    <ColorPicker.Root defaultValue="#ff0000">
      <ColorPicker.Palette />
    </ColorPicker.Root>,
  );
  const palette = container.querySelector<HTMLElement>('[data-slot="color-picker-palette"]');
  if (!palette) throw new Error("ColorPicker palette did not render.");
  return { container, palette };
}

function pointerEvent(type: string, clientX: number, clientY: number) {
  const event = new Event(type, { bubbles: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
    pointerId: { value: 1 },
  });
  return event;
}

describe("ColorPicker palette", () => {
  it("renders an indicator at the current saturation and lightness", () => {
    const { palette } = renderPalette();
    const indicator = palette.querySelector('[data-slot="color-picker-palette-indicator"]');

    expect(indicator).not.toBeNull();
    expect(palette.style.getPropertyValue("--jaci-color-palette-saturation")).toBe("100%");
    expect(palette.style.getPropertyValue("--jaci-color-palette-lightness")).toBe("0%");
  });

  it("updates continuously while dragging across the palette", () => {
    const { container, palette } = renderPalette();
    Object.defineProperty(palette, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ height: 100, left: 10, top: 20, width: 200 }),
    });

    act(() => palette.dispatchEvent(pointerEvent("pointerdown", 10, 20)));
    act(() => palette.dispatchEvent(pointerEvent("pointermove", 110, 70)));
    act(() => palette.dispatchEvent(pointerEvent("pointerup", 110, 70)));

    expect(palette.style.getPropertyValue("--jaci-color-palette-saturation")).toBe("50%");
    expect(palette.style.getPropertyValue("--jaci-color-palette-lightness")).toBe("50%");
    expect(container.querySelector('[data-dragging="true"]')).toBeNull();
  });

  it("maps the saturated top-right corner to the hue instead of white", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <ColorPicker.Root defaultValue="#ff0000" onValueChange={onValueChange}>
        <ColorPicker.Palette />
      </ColorPicker.Root>,
    );
    const palette = container.querySelector<HTMLElement>('[data-slot="color-picker-palette"]');
    if (!palette) throw new Error("ColorPicker palette did not render.");

    Object.defineProperty(palette, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ height: 100, left: 10, top: 20, width: 200 }),
    });

    act(() => palette.dispatchEvent(pointerEvent("pointerdown", 210, 20)));

    expect(onValueChange).toHaveBeenLastCalledWith("#ff0000");
    expect(palette.style.getPropertyValue("--jaci-color-palette-saturation")).toBe("100%");
    expect(palette.style.getPropertyValue("--jaci-color-palette-lightness")).toBe("0%");
  });

  it("provides the selected hue and opacity colors to the range controls", () => {
    const container = renderInDocument(
      <ColorPicker.Root defaultValue="rgba(37, 99, 235, 0.75)" showAlpha>
        <ColorPicker.Hue />
        <ColorPicker.Alpha />
        <ColorPicker.NativeInput />
      </ColorPicker.Root>,
    );
    const hue = container.querySelector<HTMLInputElement>('[data-slot="color-picker-hue"]');
    const alpha = container.querySelector<HTMLInputElement>('[data-slot="color-picker-alpha"]');
    const nativeInput = container.querySelector<HTMLInputElement>(
      '[data-slot="color-picker-native-input"]',
    );
    if (!hue || !alpha || !nativeInput) throw new Error("Color controls were not rendered.");

    expect(hue.style.getPropertyValue("--jaci-color-picker-thumb-color")).toContain("hsl(");
    expect(alpha.style.getPropertyValue("--jaci-color-picker-alpha-color")).toBe(
      "rgb(37, 99, 235)",
    );
    expect(alpha.style.getPropertyValue("--jaci-color-picker-thumb-color")).toBe(
      "rgb(37, 99, 235)",
    );
    expect(nativeInput.value).toBe("#2563eb");
  });

  it("does not render the alpha control unless alpha is enabled", () => {
    const container = renderInDocument(
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.Alpha />
      </ColorPicker.Root>,
    );
    expect(container.querySelector('[data-slot="color-picker-alpha"]')).toBeNull();
  });
});
