// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { AlertDialog } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("AlertDialog", () => {
  it("uses flexible action styles for labelled and icon-only closes", () => {
    const container = renderInDocument(
      <AlertDialog.Root>
        <AlertDialog.Cancel>Keep editing</AlertDialog.Cancel>
        <AlertDialog.Close />
      </AlertDialog.Root>,
    );

    expect(container.querySelector('[data-slot="alert-dialog-cancel"]')?.className).toContain(
      "dialog__action",
    );
    expect(container.querySelector('[data-slot="alert-dialog-close"]')?.className).toContain(
      "dialog__close",
    );
  });
});
