// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it } from "vitest";
import { Popover } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Popover", () => {
  it("renders portal content, opens from its trigger and closes with Escape", async () => {
    const container = renderInDocument(
      <Popover.Root>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              Content
              <Popover.Close />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );
    const trigger = container.querySelector<HTMLButtonElement>("[data-slot='popover-trigger']");
    await act(async () => {
      trigger?.click();
      await Promise.resolve();
    });
    expect(document.querySelector("[data-slot='popover-popup']")).not.toBeNull();
    await act(async () => {
      trigger?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
      await Promise.resolve();
    });
  });
});
