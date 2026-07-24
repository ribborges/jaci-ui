// @vitest-environment jsdom

import { act } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeProvider, useTheme } from "./theme-provider";
import { renderInDocument } from "../test-utils/react";

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme}
    </button>
  );
}

describe("ThemeProvider", () => {
  it("renders a deterministic system theme on the server", () => {
    const html = renderToString(
      <ThemeProvider defaultTheme="system" ssrTheme="dark">
        <span>Content</span>
      </ThemeProvider>,
    );

    expect(html).toContain('data-jaci-theme="dark"');
    expect(html).toContain('data-jaci-component="theme-provider"');
  });

  it("applies scoped semantic tokens and supports uncontrolled changes", () => {
    const container = renderInDocument(
      <ThemeProvider defaultTheme="light" tokens={{ colors: { accent: { default: "#7c3aed" } } }}>
        <ThemeButton />
      </ThemeProvider>,
    );
    const provider = container.firstElementChild as HTMLElement;
    const button = container.querySelector("button");

    expect(provider.dataset.jaciTheme).toBe("light");
    expect(provider.style.getPropertyValue("--jaci-colors-accent-default")).toBe("#7c3aed");

    act(() => button?.click());
    expect(provider.dataset.jaciTheme).toBe("dark");
  });

  it("supports a controlled mode and local element props", () => {
    const changes: string[] = [];
    const container = renderInDocument(
      <ThemeProvider
        as="section"
        id="theme-scope"
        theme="dark"
        onThemeChange={(next) => changes.push(next)}
      >
        <ThemeButton />
      </ThemeProvider>,
    );
    const button = container.querySelector("button");

    act(() => button?.click());
    expect(container.querySelector("section")?.id).toBe("theme-scope");
    expect(changes).toEqual(["light"]);
    expect(container.querySelector("section")?.dataset.jaciTheme).toBe("dark");
  });
});
