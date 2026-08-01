import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Heading, Paragraph, Text } from "../../index";

describe("Typography", () => {
  it("renders heading, text and compatibility paragraph APIs", () => {
    const html = renderToString(
      <>
        <Heading as="h1" weight="bold" lineClamp={2}>
          Title
        </Heading>
        <Text width="full" truncate>
          Summary
        </Text>
        <Paragraph>Legacy paragraph</Paragraph>
      </>,
    );

    expect(html).toContain('data-jaci-component="heading"');
    expect(html).toContain('data-jaci-component="text"');
    expect(html).toContain('data-jaci-component="paragraph"');
    expect(html).toContain("Legacy paragraph");
  });
});
