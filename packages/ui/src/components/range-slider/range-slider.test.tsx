// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { RangeSlider } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("RangeSlider", () => {
  it("renders both thumbs for an interval value", () => {
    const container = renderInDocument(
      <RangeSlider.Root defaultValue={[20, 80]} aria-label="Price range">
        <RangeSlider.Track>
          <RangeSlider.Indicator />
          <RangeSlider.Thumb index={0} aria-label="Minimum" />
          <RangeSlider.Thumb index={1} aria-label="Maximum" />
        </RangeSlider.Track>
      </RangeSlider.Root>,
    );

    expect(container.querySelectorAll('[data-slot="range-slider-thumb"]')).toHaveLength(2);
  });
});
