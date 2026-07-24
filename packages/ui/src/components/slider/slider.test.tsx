// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Slider", () => {
  it("moves its thumb with the keyboard and emits the next value", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <Slider.Root defaultValue={50} min={0} max={100} step={10} onValueChange={onValueChange}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Volume" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const thumb = container.querySelector<HTMLElement>('[data-slot="slider-thumb"]');
    if (!thumb) throw new Error("Slider thumb was not rendered.");
    const input = thumb.querySelector<HTMLInputElement>("input[type='range']");
    if (!input) throw new Error("Slider input was not rendered.");
    expect(input.getAttribute("aria-valuenow")).toBe("50");
    act(() => {
      input.focus();
      input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }));
    });
    expect(onValueChange.mock.calls[0]?.[0]).toBe(60);
  });
});
