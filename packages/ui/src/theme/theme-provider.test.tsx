// @vitest-environment jsdom

import { act } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeProvider, useTheme } from "./theme-provider";
import { useThemePortalContainer } from "./theme-scope";
import { Dialog } from "../components/dialog";
import { renderInDocument } from "../test-utils/react";

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      {resolvedTheme}
    </button>
  );
}

function PortalScopeProbe() {
  const container = useThemePortalContainer();
  return <span data-portal-scope={container ? "local" : "default"} />;
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

  it("provides the nearest mounted theme element as the popup portal scope", () => {
    const container = renderInDocument(
      <ThemeProvider>
        <PortalScopeProbe />
      </ThemeProvider>,
    );

    expect(container.querySelector("[data-portal-scope=local]")).not.toBeNull();
  });

  it("mounts Jaci portals inside the nearest provider", () => {
    const container = renderInDocument(
      <ThemeProvider tokens={{ colors: { accent: { default: "#7c3aed" } } }}>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup aria-label="Themed dialog">Dialog content</Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      </ThemeProvider>,
    );

    const provider = container.querySelector('[data-slot="theme-provider"]');
    const popup = container.querySelector('[data-slot="dialog-popup"]');
    expect(provider).not.toBeNull();
    expect(popup).not.toBeNull();
    expect(provider?.contains(popup)).toBe(true);
  });
});
