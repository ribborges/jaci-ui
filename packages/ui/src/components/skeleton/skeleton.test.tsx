import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Skeleton } from "../../index";

describe("Skeleton", () => {
  it("keeps the decorative placeholder hidden from assistive technology", () => {
    const html = renderToString(<Skeleton variant="text" animated={false} />);

    expect(html).toContain('data-jaci-component="skeleton"');
    expect(html).toContain('data-variant="text"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('data-animated="true"');
  });
});
