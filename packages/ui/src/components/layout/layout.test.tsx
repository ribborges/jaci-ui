import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Flex, Grid, Separator, Spinner, Stack } from "../../index";

describe("Layout primitives", () => {
  it("renders layout and separator markers during SSR", () => {
    const html = renderToString(
      <>
        <Stack gap="sm">Stack</Stack>
        <Flex>Flex</Flex>
        <Grid columns={2}>Grid</Grid>
        <Separator orientation="vertical" />
        <Spinner label="Loading layout" />
      </>,
    );

    expect(html).toContain('data-jaci-component="stack"');
    expect(html.match(/data-jaci-component="stack"/g)).toHaveLength(2);
    expect(html).toContain('data-jaci-component="grid"');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('role="status"');
  });
});
