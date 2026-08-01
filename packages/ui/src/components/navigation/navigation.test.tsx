// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { BottomNavigation, Navbar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("navigation", () => {
  it("marks active links and opens the controlled mobile drawer", async () => {
    const onOpenChange = vi.fn();
    const container = renderInDocument(
      <Navbar.Root open={false} onOpenChange={onOpenChange}>
        <Navbar.Bar aria-label="Main">
          <Navbar.Toggle />
        </Navbar.Bar>
        <Navbar.Drawer>
          <Navbar.Close />
        </Navbar.Drawer>
      </Navbar.Root>,
    );
    const toggle = container.querySelector<HTMLButtonElement>("[data-slot='navbar-toggle']");
    await act(async () => {
      toggle?.click();
      await Promise.resolve();
    });
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    const bottom = renderInDocument(
      <BottomNavigation aria-label="Sections">
        <BottomNavigation.Item active href="#home">
          Home
        </BottomNavigation.Item>
      </BottomNavigation>,
    );
    expect(bottom.querySelector("a")?.getAttribute("aria-current")).toBe("page");
  });
});
