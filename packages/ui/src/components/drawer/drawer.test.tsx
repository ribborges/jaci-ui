// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Drawer } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Drawer", () => {
  it("uses flexible action styles for labelled and icon-only closes", () => {
    const container = renderInDocument(
      <Drawer.Root>
        <Drawer.Close>Done</Drawer.Close>
        <Drawer.Close />
      </Drawer.Root>,
    );

    expect(container.querySelector('[data-slot="drawer-close"]')?.className).toContain(
      "drawer__action",
    );
    expect(container.querySelectorAll('[data-slot="drawer-close"]')[1]?.className).toContain(
      "drawer__close",
    );
  });
});
