import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Stat, StatGroup } from "../../index";

describe("StatGroup", () => {
  it("renders a responsive group with semantic stats", () => {
    const html = renderToString(
      <StatGroup.Root columns={2} gap="sm">
        <Stat.Root tone="success">
          <Stat.Label>Revenue</Stat.Label>
          <Stat.Value>$12k</Stat.Value>
          <Stat.Trend direction="up">18%</Stat.Trend>
        </Stat.Root>
      </StatGroup.Root>,
    );

    expect(html).toContain('data-jaci-component="stat-group"');
    expect(html).toContain('data-jaci-component="stat"');
    expect(html).toContain('data-direction="up"');
  });
});
