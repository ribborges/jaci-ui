// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Collapsible } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Collapsible", () => {
  it("toggles from its uncontrolled state and exposes the trigger semantics", () => {
    const onOpenChange = vi.fn();
    const container = renderInDocument(
      <Collapsible.Root defaultOpen onOpenChange={onOpenChange}>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel>Content</Collapsible.Panel>
      </Collapsible.Root>,
    );
    const trigger = container.querySelector<HTMLButtonElement>("[data-slot='collapsible-trigger']");
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");
    act(() => trigger?.click());
    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
