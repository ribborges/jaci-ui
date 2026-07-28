// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { AspectRatio } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("AspectRatio", () => {
  it("sets a valid ratio without touching browser globals during render", () => {
    const container = renderInDocument(
      <AspectRatio ratio={16 / 9}>
        <div>Content</div>
      </AspectRatio>,
    );

    expect(
      Number(
        container.querySelector<HTMLElement>('[data-jaci-component="aspect-ratio"]')?.style
          .aspectRatio,
      ),
    ).toBeCloseTo(16 / 9);
  });
});
