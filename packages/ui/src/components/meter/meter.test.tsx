// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Meter } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Meter", () => {
  it("renders the semantic value and proportional indicator", () => {
    const container = renderInDocument(
      <Meter.Root value={40} aria-label="Storage">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );

    expect(container.querySelector('[role="meter"]')?.getAttribute("aria-valuenow")).toBe("40");
    expect(container.querySelector<HTMLElement>('[data-slot="meter-indicator"]')?.style.width).toBe(
      "40%",
    );
  });
});
