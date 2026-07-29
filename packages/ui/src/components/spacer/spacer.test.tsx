import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Spacer } from "../../index";

describe("Spacer", () => {
  it("is decorative and exposes its axis and size", () => {
    const html = renderToString(<Spacer axis="horizontal" size="lg" />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-axis="horizontal"');
    expect(html).toContain('data-size="lg"');
  });
});
