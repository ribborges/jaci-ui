// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Menu } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Menu", () => {
  it("opens from the trigger and closes with Escape", () => {
    const container = renderInDocument(
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Save</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    const trigger = container.querySelector<HTMLButtonElement>("button");
    if (!trigger) throw new Error("Menu trigger was not rendered.");

    act(() => trigger.click());
    expect(document.querySelector('[data-slot="menu-popup"]')).not.toBeNull();
    act(() => {
      trigger.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }));
    });
    expect(document.querySelector('[data-slot="menu-popup"]')).toBeNull();
  });
});
