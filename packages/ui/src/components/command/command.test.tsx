// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Command } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Command", () => {
  it("filters by keywords and selects the highlighted item with Enter", () => {
    const onSelect = vi.fn();
    const container = renderInDocument(
      <Command.Root defaultSearch="compile">
        <Command.Input aria-label="Commands" />
        <Command.List>
          <Command.Item value="build" keywords={["compile"]} onSelect={onSelect}>
            Build
          </Command.Item>
          <Command.Item value="test">Test</Command.Item>
          <Command.Empty>No results</Command.Empty>
        </Command.List>
      </Command.Root>,
    );

    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) throw new Error("Command input was not rendered.");
    act(() => {
      input.focus();
      input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    });

    expect(onSelect).toHaveBeenCalledWith("build");
    expect(container.querySelector('[data-slot="command-item"][hidden]')).not.toBeNull();
  });

  it("keeps duplicate values independent and skips disabled items", () => {
    const firstSelect = vi.fn();
    const disabledSelect = vi.fn();
    const secondSelect = vi.fn();
    const container = renderInDocument(
      <Command.Root>
        <Command.Input aria-label="Commands" />
        <Command.List>
          <Command.Group heading="Actions">
            <Command.Item value="open" onSelect={firstSelect}>
              Open project
            </Command.Item>
            <Command.Item value="open" disabled onSelect={disabledSelect}>
              Open disabled project
            </Command.Item>
            <Command.Item value="settings" onSelect={secondSelect}>
              Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Root>,
    );
    const input = container.querySelector<HTMLInputElement>("input");
    const items = container.querySelectorAll<HTMLElement>('[data-slot="command-item"]');
    if (!input || items.length !== 3) throw new Error("Command items were not rendered.");

    act(() => {
      input.focus();
      input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
    });
    expect(firstSelect).toHaveBeenCalledWith("open");
    expect(disabledSelect).not.toHaveBeenCalled();
    expect(container.querySelector('[data-disabled="true"]')).not.toBeNull();
    expect(secondSelect).not.toHaveBeenCalled();
  });

  it("hides empty groups and exposes the empty state", () => {
    const container = renderInDocument(
      <Command.Root>
        <Command.Input aria-label="Commands" />
        <Command.List>
          <Command.Group heading="Empty group" />
          <Command.Empty>No matching commands</Command.Empty>
        </Command.List>
      </Command.Root>,
    );

    expect(container.querySelector('[data-slot="command-group"]')?.hasAttribute("hidden")).toBe(
      true,
    );
    expect(container.querySelector('[data-slot="command-empty"]')?.textContent).toContain(
      "No matching commands",
    );
  });
});
