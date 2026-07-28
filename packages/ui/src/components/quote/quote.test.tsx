// @vitest-environment jsdom

import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Quote } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Quote", () => {
  it("renders a semantic blockquote with optional attribution", () => {
    const container = renderInDocument(
      <Quote author="Ada Lovelace" cite="https://example.com/quote" source="Example">
        That brain of mine is something more than merely mortal.
      </Quote>,
    );
    const element = container.querySelector("blockquote");

    expect(element).not.toBeNull();
    expect(element?.getAttribute("cite")).toBe("https://example.com/quote");
    expect(container.querySelector('[data-slot="quote-author"]')?.textContent).toBe("Ada Lovelace");
    expect(container.querySelector("cite")?.textContent).toBe("Example");
    expect(element?.getAttribute("data-variant")).toBe("default");
  });

  it("renders without browser APIs during SSR", () => {
    const html = renderToString(<Quote variant="accent">A server-safe quote.</Quote>);

    expect(html).toContain("<blockquote");
    expect(html).toContain("A server-safe quote.");
    expect(html).toContain('data-jaci-component="quote"');
  });
});
