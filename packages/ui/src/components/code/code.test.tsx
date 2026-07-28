// @vitest-environment jsdom

import { describe, expect, it } from "vitest";

import { Code } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Code", () => {
  it("uses semantic inline and block elements", () => {
    const container = renderInDocument(
      <>
        <Code>pnpm add jaci-ui</Code>
        <Code language="tsx" variant="block">
          const answer = 42;
        </Code>
      </>,
    );

    expect(container.querySelector("code")?.textContent).toContain("pnpm add jaci-ui");
    expect(container.querySelector("pre code")?.textContent).toContain("const answer");
    expect(container.querySelector('[data-language="tsx"]')).not.toBeNull();
  });
});
