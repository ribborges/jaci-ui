// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Sidebar", () => {
  it("toggles its uncontrolled state and exposes accessible navigation", () => {
    const onOpenChange = vi.fn();
    const container = renderInDocument(
      <Sidebar.Root defaultOpen onOpenChange={onOpenChange}>
        <Sidebar.Toggle />
        <Sidebar.Content>
          <Sidebar.Item active href="#home">
            Home
          </Sidebar.Item>
        </Sidebar.Content>
      </Sidebar.Root>,
    );
    const toggle = container.querySelector<HTMLButtonElement>("[data-slot='sidebar-toggle']");
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    act(() => toggle?.click());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("Sidebar navigation");
  });
});
