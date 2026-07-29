import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DownloadTrigger } from "../../index";

describe("DownloadTrigger", () => {
  it("keeps native anchor and download semantics", () => {
    const html = renderToString(
      <DownloadTrigger download="report.pdf" href="/report.pdf">
        Download
      </DownloadTrigger>,
    );
    expect(html).toContain("<a");
    expect(html).toContain('href="/report.pdf"');
    expect(html).toContain('download="report.pdf"');
  });

  it("renders a disabled trigger outside the tab order", () => {
    const html = renderToString(
      <DownloadTrigger disabled href="/report.pdf">
        Download
      </DownloadTrigger>,
    );
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('tabindex="-1"');
  });
});
