// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Select } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Select", () => {
  it("opens, selects an option and closes with Escape", () => {
    const container = renderInDocument(
      <Select.Root defaultValue="pro">
        <Select.Trigger aria-label="Workspace plan">
          <Select.Value placeholder="Choose a plan" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <Select.Item value="starter">
                  <Select.ItemText>Starter</Select.ItemText>
                </Select.Item>
                <Select.Item value="pro">
                  <Select.ItemText>Pro</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>,
    );

    const trigger = container.querySelector<HTMLButtonElement>("[aria-label='Workspace plan']");
    if (!trigger) throw new Error("Select trigger was not rendered.");

    act(() => trigger.click());
    const option = [...document.querySelectorAll<HTMLElement>('[data-slot="select-item"]')].find(
      (item) => item.textContent?.includes("Starter"),
    );
    expect(option).not.toBeNull();
    act(() => option?.click());
    expect(trigger.textContent).toContain("starter");

    expect(
      document.querySelector('[data-slot="select-item"][data-selected]')?.textContent,
    ).toContain("Starter");
  });
});
