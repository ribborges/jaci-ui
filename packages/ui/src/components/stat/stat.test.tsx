// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Stat, StatGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Stat", () => {
  it("renders composable metric content and trend state", () => {
    const container = renderInDocument(
      <StatGroup.Root columns={2}>
        <Stat.Root tone="success">
          <Stat.Label>Revenue</Stat.Label>
          <Stat.Value>$12k</Stat.Value>
          <Stat.Trend direction="up">+18%</Stat.Trend>
        </Stat.Root>
      </StatGroup.Root>,
    );

    expect(container.querySelector('[data-jaci-component="stat-group"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="stat-value"]')?.textContent).toBe("$12k");
    expect(container.querySelector('[data-direction="up"]')).not.toBeNull();
  });
});
