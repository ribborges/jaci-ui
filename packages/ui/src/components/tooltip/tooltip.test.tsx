// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Tooltip } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Tooltip", () => {
  it("renders a controlled open tooltip in the portal", () => {
    const container = renderInDocument(
      <Tooltip.Root open>
        <Tooltip.Trigger>Help</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup>
              Details
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>,
    );
    expect(container.querySelector("[data-slot='tooltip-trigger']")).not.toBeNull();
    expect(document.querySelector("[data-slot='tooltip-popup']")?.textContent).toContain("Details");
  });
});
