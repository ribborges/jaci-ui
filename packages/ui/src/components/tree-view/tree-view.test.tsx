// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { TreeView } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("TreeView", () => {
  it("expands and selects the correct item", () => {
    const onSelectedChange = vi.fn();
    const container = renderInDocument(
      <TreeView.Root onSelectedChange={onSelectedChange} aria-label="Files">
        <TreeView.Item id="src">
          <TreeView.Toggle aria-label="Toggle src" />
          <TreeView.Label>src</TreeView.Label>
          <TreeView.Group>
            <TreeView.Item id="index">
              <TreeView.Label>index.ts</TreeView.Label>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const toggle = container.querySelector<HTMLButtonElement>("button");
    const rootItem = container.querySelector<HTMLElement>('[data-slot="tree-view-item"]');
    const group = container.querySelector('[data-slot="tree-view-group"]');
    if (!toggle || !rootItem || !group) throw new Error("TreeView did not render its root item.");

    expect(group.hasAttribute("hidden")).toBe(true);
    act(() => toggle.click());
    expect(group.hasAttribute("hidden")).toBe(false);
    act(() => rootItem.click());
    expect(onSelectedChange).toHaveBeenCalledWith("src");

    const childItem = group.querySelector<HTMLElement>('[data-slot="tree-view-item"]');
    if (!childItem) throw new Error("TreeView child item was not rendered.");
    act(() => childItem.click());
    expect(onSelectedChange).toHaveBeenLastCalledWith("index");
  });

  it("collapses nested groups independently", () => {
    const container = renderInDocument(
      <TreeView.Root defaultExpanded={["src", "components"]} aria-label="Files">
        <TreeView.Item id="src">
          <TreeView.Toggle aria-label="Toggle src" />
          <TreeView.Label>src</TreeView.Label>
          <TreeView.Group>
            <TreeView.Item id="components">
              <TreeView.Toggle aria-label="Toggle components" />
              <TreeView.Label>components</TreeView.Label>
              <TreeView.Group>
                <TreeView.Item id="button">
                  <TreeView.Label>button.tsx</TreeView.Label>
                </TreeView.Item>
              </TreeView.Group>
            </TreeView.Item>
          </TreeView.Group>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const toggles = container.querySelectorAll<HTMLButtonElement>('[data-slot="tree-view-toggle"]');
    const groups = container.querySelectorAll<HTMLElement>('[data-slot="tree-view-group"]');
    expect(toggles).toHaveLength(2);
    expect(groups[0]?.hasAttribute("hidden")).toBe(false);
    expect(groups[1]?.hasAttribute("hidden")).toBe(false);

    act(() => toggles[1]?.click());
    expect(groups[0]?.hasAttribute("hidden")).toBe(false);
    expect(groups[1]?.hasAttribute("hidden")).toBe(true);
    act(() => toggles[0]?.click());
    expect(groups[0]?.hasAttribute("hidden")).toBe(true);
    act(() => toggles[0]?.click());
    expect(groups[0]?.hasAttribute("hidden")).toBe(false);
    expect(groups[1]?.hasAttribute("hidden")).toBe(true);
  });

  it("supports declarative lazy children and loading state", () => {
    const container = renderInDocument(
      <TreeView.Root aria-label="Packages">
        <TreeView.Item id="packages" hasChildren loading>
          <TreeView.Toggle aria-label="Toggle packages" />
          <TreeView.Label>packages</TreeView.Label>
        </TreeView.Item>
        <TreeView.Loading>Loading children…</TreeView.Loading>
      </TreeView.Root>,
    );
    const item = container.querySelector<HTMLElement>('[data-slot="tree-view-item"]');
    const toggle = container.querySelector<HTMLButtonElement>('[data-slot="tree-view-toggle"]');
    if (!item || !toggle) throw new Error("Lazy tree item was not rendered.");

    expect(item.getAttribute("aria-busy")).toBe("true");
    expect(item.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector('[data-slot="tree-view-loading"]')).not.toBeNull();
    act(() => toggle.click());
    expect(item.getAttribute("aria-expanded")).toBe("true");
  });
});
