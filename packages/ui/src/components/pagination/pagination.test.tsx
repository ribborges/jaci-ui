// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Pagination", () => {
  it("generates pages, ellipses and first/last controls", () => {
    const onPageChange = vi.fn();
    const container = renderInDocument(
      <Pagination.Root defaultPage={4} pageCount={10} onPageChange={onPageChange} showFirstLast />,
    );
    expect(
      container.querySelectorAll('[data-slot="pagination-link"][data-page]').length,
    ).toBeGreaterThan(1);
    expect(container.querySelector('[data-slot="pagination-first"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="pagination-last"]')).not.toBeNull();

    const pageThree = container.querySelector<HTMLAnchorElement>(
      '[data-slot="pagination-link"][data-page="3"]',
    );
    if (!pageThree) throw new Error("Generated page link was not rendered.");
    act(() => pageThree.click());
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("supports manual composition and disabled controls", () => {
    const container = renderInDocument(
      <Pagination.Root density="compact" aria-label="Results pages">
        <Pagination.List>
          <Pagination.Item>
            <Pagination.Previous disabled />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link active href="#page-1">
              1
            </Pagination.Link>
          </Pagination.Item>
        </Pagination.List>
      </Pagination.Root>,
    );
    const root = container.querySelector('[data-slot="pagination"]');
    const previous = container.querySelector('[data-slot="pagination-previous"]');
    expect(root?.getAttribute("data-density")).toBe("compact");
    expect(previous?.getAttribute("aria-disabled")).toBe("true");
    expect(previous?.getAttribute("tabindex")).toBe("-1");
  });
});
