// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Dialog } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Dialog", () => {
  it("uses flexible action styles for labelled and icon-only closes", () => {
    const container = renderInDocument(
      <Dialog.Root>
        <Dialog.Close>Cancel</Dialog.Close>
        <Dialog.Close />
      </Dialog.Root>,
    );

    expect(container.querySelector('[data-slot="dialog-close"]')?.className).toContain(
      "dialog__action",
    );
    expect(container.querySelectorAll('[data-slot="dialog-close"]')[1]?.className).toContain(
      "dialog__close",
    );
  });
});
