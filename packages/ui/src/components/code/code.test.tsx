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

  it("renders stable line numbers for textual block content", () => {
    const container = renderInDocument(
      <Code lineNumbers variant="block">
        {"first\n\nthird\n"}
      </Code>,
    );

    expect(container.querySelector('[data-line-numbers="true"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="code-line-number"]')).toHaveLength(4);
    expect(container.querySelector("pre code")?.textContent).toBe("first\n\nthird\n");
    expect(container.querySelector('[data-slot="code-gutter"]')?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("does not transform non-textual children", () => {
    const container = renderInDocument(
      <Code lineNumbers variant="block">
        <span>custom</span>
      </Code>,
    );

    expect(container.querySelector('[data-line-numbers="true"]')).toBeNull();
    expect(container.querySelector("pre code span")?.textContent).toBe("custom");
  });
});
