import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "../../index";

describe("VisuallyHidden", () => {
  it("renders content with a stable server-safe marker", () => {
    const html = renderToString(<VisuallyHidden>Accessible label</VisuallyHidden>);

    expect(html).toContain('data-jaci-component="visually-hidden"');
    expect(html).toContain('data-slot="visually-hidden"');
    expect(html).toContain("Accessible label");
  });
});
