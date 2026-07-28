// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { Figure } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Figure", () => {
  it("keeps its caption visible in the configurable lightbox", () => {
    const container = renderInDocument(
      <Figure.Root lightbox>
        <Figure.Image alt="Preview" src="/preview.svg" />
        <Figure.Caption>Gallery preview</Figure.Caption>
      </Figure.Root>,
    );

    act(() => container.querySelector<HTMLButtonElement>('[data-slot="figure-trigger"]')?.click());

    expect(document.body.querySelector('[data-slot="figure-lightbox-image"]')).not.toBeNull();
    expect(document.body.querySelector('[data-slot="figure-lightbox-caption"]')?.textContent).toBe(
      "Gallery preview",
    );
  });
});
