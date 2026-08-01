import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Tabs } from "../../index";

describe("Tabs", () => {
  it("renders the tab list and panel composition during SSR", () => {
    const html = renderToString(
      <Tabs.Root defaultValue="overview" aria-label="Project sections">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Summary</Tabs.Panel>
      </Tabs.Root>,
    );

    expect(html).toContain('data-jaci-component="tabs"');
    expect(html).toContain('data-slot="tabs-list"');
    expect(html).toContain('data-slot="tabs-panel"');
  });
});
