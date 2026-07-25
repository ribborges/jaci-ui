// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { DataToolbar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("DataToolbar", () => {
  it("supports controlled search, sorting and selection clearing", () => {
    const onSearchChange = vi.fn();
    const onSortChange = vi.fn();
    const onClear = vi.fn();
    const container = renderInDocument(
      <DataToolbar.Root>
        <DataToolbar.Search value="projects" onValueChange={onSearchChange} />
        <DataToolbar.Sort value="name" onValueChange={onSortChange}>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </DataToolbar.Sort>
        <DataToolbar.Selection count={2} onClear={onClear}>
          <DataToolbar.ClearSelection />
        </DataToolbar.Selection>
      </DataToolbar.Root>,
    );
    const search = container.querySelector<HTMLInputElement>("input");
    const sort = container.querySelector<HTMLSelectElement>("select");
    const clear = container.querySelector<HTMLButtonElement>(
      '[data-slot="data-toolbar-clear-selection"]',
    );
    if (!search || !sort || !clear) throw new Error("DataToolbar controls were not rendered.");

    act(() => {
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setValue?.call(search, "docs");
      search.dispatchEvent(new Event("input", { bubbles: true }));
      sort.value = "status";
      sort.dispatchEvent(new Event("change", { bubbles: true }));
      clear.click();
    });
    expect(onSearchChange).toHaveBeenCalledWith("docs");
    expect(onSortChange).toHaveBeenCalledWith("status");
    expect(onClear).toHaveBeenCalledOnce();
  });
});
