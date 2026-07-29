import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ColorSwatch } from "../../index";

describe("ColorSwatch", () => {
  it("renders the requested color and stable state attributes", () => {
    const html = renderToString(
      <ColorSwatch color="#2563eb" label="Accent" shape="square" size="lg" />,
    );
    expect(html).toContain('data-color="#2563eb"');
    expect(html).toContain('data-shape="square"');
    expect(html).toContain('aria-label="Accent"');
  });
});
