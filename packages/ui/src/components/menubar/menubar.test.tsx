// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Menubar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Menubar", () => {
  it("opens a menu and moves between top-level triggers with arrows", () => {
    const container = renderInDocument(
      <Menubar.Root>
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup>
                <Menubar.Item>New project</Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup>
                <Menubar.Item>Undo</Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
    );
    const triggers = container.querySelectorAll<HTMLButtonElement>("[data-slot='menubar-trigger']");
    expect(triggers).toHaveLength(2);
    act(() => triggers[0]?.click());
    expect(document.querySelector('[data-slot="menubar-popup"]')).not.toBeNull();
    act(() => {
      triggers[0]?.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "ArrowRight" }),
      );
    });
    expect(triggers[1]).toBeTruthy();
  });
});
