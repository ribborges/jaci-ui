// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";

import { Table } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function renderTable(props?: ComponentProps<typeof Table.Root>) {
  return renderInDocument(
    <Table.Root {...props}>
      <Table.Header>
        <Table.Row id="header">
          <Table.SelectionHeader />
          <Table.Head id="name" sortable>
            Name
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row id="ada">
          <Table.SelectionCell />
          <Table.Cell>Ada</Table.Cell>
        </Table.Row>
        <Table.Row id="grace" selectionDisabled>
          <Table.SelectionCell />
          <Table.Cell>Grace</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
}

describe("Table", () => {
  it("controls multiple selection and excludes disabled rows from select all", () => {
    const onSelectionChange = vi.fn();
    const container = renderTable({ selectionMode: "multiple", onSelectionChange });
    const header = container.querySelector<HTMLInputElement>(
      '[data-slot="table-selection-header"] input',
    );
    const row = container.querySelector<HTMLInputElement>(
      '[data-slot="table-selection-cell"] input',
    );
    if (!header || !row) throw new Error("Table selection controls were not rendered.");

    expect(
      container.querySelector('[data-slot="table-selection-cell"] input:disabled'),
    ).not.toBeNull();

    act(() => header.click());
    expect(onSelectionChange).toHaveBeenLastCalledWith(["ada"]);
    expect(header.getAttribute("aria-checked")).toBe("true");

    act(() => row.click());
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("cycles sort direction and exposes aria-sort", () => {
    const onSortChange = vi.fn();
    const container = renderTable({ onSortChange });
    const button = container.querySelector<HTMLButtonElement>('[data-slot="table-head"] button');
    const head = container.querySelector('[data-slot="table-head"]');
    if (!button || !head) throw new Error("Sortable table head was not rendered.");

    act(() => button.click());
    expect(onSortChange).toHaveBeenLastCalledWith({ id: "name", direction: "ascending" });
    expect(head.getAttribute("aria-sort")).toBe("ascending");
    act(() => button.click());
    expect(onSortChange).toHaveBeenLastCalledWith({ id: "name", direction: "descending" });
    act(() => button.click());
    expect(onSortChange).toHaveBeenLastCalledWith(null);
  });

  it("keeps loading status and accessible description on the table", () => {
    const container = renderTable({ status: "loading", "aria-describedby": "table-description" });
    const table = container.querySelector("table");
    if (!table) throw new Error("Table was not rendered.");
    expect(table.getAttribute("aria-busy")).toBe("true");
    expect(table.getAttribute("data-status")).toBe("loading");
    expect(table.getAttribute("aria-describedby")).toBe("table-description");
  });
});
