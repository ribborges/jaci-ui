// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { ContextMenu } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("ContextMenu", () => {
  it("opens on the contextmenu event and exposes menu items", () => {
    const container = renderInDocument(
      <ContextMenu.Root>
        <ContextMenu.Trigger>Canvas</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Copy link</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );
    const trigger = container.querySelector<HTMLElement>("[data-slot='context-menu-trigger']");
    if (!trigger) throw new Error("Context menu trigger was not rendered.");

    act(() => {
      trigger.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, button: 2 }));
    });
    expect(document.querySelector('[data-slot="context-menu-popup"]')).not.toBeNull();
  });
});
