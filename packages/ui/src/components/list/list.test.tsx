import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { List } from "../../index";

describe("List", () => {
  it("renders ordered items and state markers during SSR", () => {
    const html = renderToString(
      <List.Root ordered variant="divided" density="compact">
        <List.Item selected>
          <List.ItemContent>
            <List.ItemTitle>Project</List.ItemTitle>
            <List.ItemDescription>Current project</List.ItemDescription>
          </List.ItemContent>
        </List.Item>
      </List.Root>,
    );

    expect(html).toContain('data-jaci-component="list"');
    expect(html).toContain('data-density="compact"');
    expect(html).toContain('data-selected="true"');
    expect(html).toContain("<ol");
  });
});
