// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it } from "vitest";
import { Toolbar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Toolbar", () => {
  it("keeps semantic orientation and keyboard-navigable controls", async () => {
    const container = renderInDocument(
      <Toolbar.Root aria-label="Actions" orientation="vertical">
        <Toolbar.Button>Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Input aria-label="Search" />
      </Toolbar.Root>,
    );
    const root = container.querySelector<HTMLElement>("[data-slot='toolbar']");
    const buttons = container.querySelectorAll<HTMLButtonElement>("[data-slot='toolbar-button']");
    expect(root?.getAttribute("data-orientation")).toBe("vertical");
    await act(async () => {
      buttons[0]?.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }));
      await Promise.resolve();
    });
    expect(buttons).toHaveLength(2);
    expect(container.querySelector("[data-slot='toolbar-input']")).not.toBeNull();
  });
});
