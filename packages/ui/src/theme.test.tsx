// @vitest-environment jsdom

import type { CSSProperties } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "./index";
import { renderInDocument } from "./test-utils/react";

describe("theme contract", () => {
  it("keeps light and dark themes as server-provided attributes", () => {
    const container = renderInDocument(
      <>
        <section data-jaci-theme="light">
          <Button>Light</Button>
        </section>
        <section data-jaci-theme="dark">
          <Button>Dark</Button>
        </section>
      </>,
    );

    expect(container.querySelectorAll("[data-jaci-theme]")).toHaveLength(2);
    expect(container.querySelector('[data-jaci-theme="light"] button')?.textContent).toBe("Light");
    expect(container.querySelector('[data-jaci-theme="dark"] button')?.textContent).toBe("Dark");
  });

  it("allows a scoped accent and on-accent foreground to be customized", () => {
    const style = {
      "--jaci-colors-accent-default": "#7c3aed",
      "--jaci-colors-fg-on-accent": "#ffffff",
    } as CSSProperties;
    const container = renderInDocument(
      <section data-jaci-theme="light" style={style}>
        <Button variant="solid">Custom accent</Button>
      </section>,
    );
    const section = container.querySelector("section");
    expect(section?.getAttribute("style")).toContain("--jaci-colors-accent-default: #7c3aed");
    expect(section?.getAttribute("style")).toContain("--jaci-colors-fg-on-accent: #ffffff");
  });
});
