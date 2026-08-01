import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Progress } from "../../index";

describe("Progress", () => {
  it("renders determined and indeterminate semantics during SSR", () => {
    const html = renderToString(
      <>
        <Progress value={72} max={100} label="Storage" locale="en-US" />
        <Progress indeterminate aria-label="Uploading" />
      </>,
    );

    expect(html).toContain('data-jaci-component="progress"');
    expect(html).toContain('aria-valuenow="72"');
    expect(html).toContain('data-indeterminate="true"');
    expect(html).toContain('aria-busy="true"');
  });
});
