// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Combobox } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Combobox", () => {
  it("opens its list and filters items from the input", () => {
    const container = renderInDocument(
      <Combobox.Root items={["React", "Vite"]} itemToStringLabel={(item) => item}>
        <Combobox.InputGroup>
          <Combobox.Input aria-label="Framework" />
          <Combobox.Trigger aria-label="Open frameworks">
            <Combobox.Icon />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    );

    const input = container.querySelector<HTMLInputElement>("input");
    const trigger = container.querySelector<HTMLButtonElement>("button");
    if (!input || !trigger) throw new Error("Combobox controls were not rendered.");

    act(() => trigger.click());
    expect(document.querySelector('[data-slot="combobox-item"]')).not.toBeNull();
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, "vite");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(document.body.textContent).toContain("Vite");
    expect(document.body.textContent).not.toContain("React");
  });
});
