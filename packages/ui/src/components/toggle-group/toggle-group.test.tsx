// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("ToggleGroup", () => {
  it("supports multiple values and exposes its orientation", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <ToggleGroup.Root multiple onValueChange={onValueChange} orientation="vertical">
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      </ToggleGroup.Root>,
    );
    const items = container.querySelectorAll<HTMLButtonElement>("[data-slot='toggle-group-item']");
    act(() => items[0]?.click());
    expect(onValueChange).toHaveBeenCalledWith(["grid"]);
    expect(
      container.querySelector("[data-slot='toggle-group']")?.getAttribute("data-orientation"),
    ).toBe("vertical");
  });
});
