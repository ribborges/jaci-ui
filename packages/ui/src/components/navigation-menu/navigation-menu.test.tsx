// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { NavigationMenu } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("NavigationMenu", () => {
  it("opens and dismisses content through trigger and outside press", async () => {
    const container = renderInDocument(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="components">
            <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
            <NavigationMenu.Content keepMounted>
              <NavigationMenu.Link href="/button">Button</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>,
    );

    const trigger = container.querySelector<HTMLButtonElement>(
      '[data-slot="navigation-menu-trigger"]',
    );
    const viewport = container.querySelector<HTMLElement>('[data-slot="navigation-menu-viewport"]');
    if (!trigger || !viewport) throw new Error("NavigationMenu anatomy was not rendered.");

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await act(async () => {
      trigger.click();
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(viewport.getAttribute("data-open")).toBe("true");
    expect(container.querySelector('[data-slot="navigation-menu-link"]')).not.toBeNull();

    await act(async () => {
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(viewport.getAttribute("data-open")).toBe("false");

    await act(async () => {
      trigger.click();
    });
    await act(async () => {
      trigger.click();
    });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
