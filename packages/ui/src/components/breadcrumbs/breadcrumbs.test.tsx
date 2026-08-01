import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "../../index";

describe("Breadcrumbs", () => {
  it("renders a labelled ordered navigation trail", () => {
    const html = renderToString(
      <Breadcrumbs.Root aria-label="Documentation path">
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="/docs">Docs</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item>
            <Breadcrumbs.Current>Installation</Breadcrumbs.Current>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );

    expect(html).toContain('data-jaci-component="breadcrumbs"');
    expect(html).toContain('aria-label="Documentation path"');
    expect(html).toContain('data-slot="breadcrumbs-current"');
    expect(html).toContain('aria-current="page"');
  });
});
