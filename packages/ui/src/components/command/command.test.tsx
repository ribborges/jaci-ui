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
});
