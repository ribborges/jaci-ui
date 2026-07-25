// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { DataView as JaciDataView, List } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("DataView and List", () => {
  it("exposes status and layout slots without owning data state", () => {
    const container = renderInDocument(
      <JaciDataView.Root layout="grid" columns={2} status="loading">
        <JaciDataView.Filters data-testid="filters" />
        <JaciDataView.Content>
          <List.Root ordered density="compact">
            <List.Item>One</List.Item>
          </List.Root>
        </JaciDataView.Content>
        <JaciDataView.Footer data-testid="footer" />
      </JaciDataView.Root>,
    );
    const root = container.querySelector('[data-slot="data-view"]');
    const list = container.querySelector("ol");
    expect(root?.getAttribute("data-status")).toBe("loading");
    expect(root?.getAttribute("aria-busy")).toBe("true");
    expect(container.querySelector('[data-testid="filters"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="footer"]')).not.toBeNull();
    expect(list?.getAttribute("data-density")).toBe("compact");
  });
});
