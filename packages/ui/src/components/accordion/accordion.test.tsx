// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Accordion", () => {
  it("opens its default item and reports controlled changes", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <Accordion.Root defaultValue={["one"]} onValueChange={onValueChange}>
        <Accordion.Item value="one">
          <Accordion.Header>
            <Accordion.Trigger>One</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Content</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item disabled value="two">
          <Accordion.Header>
            <Accordion.Trigger>Two</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Hidden</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const triggers = container.querySelectorAll<HTMLButtonElement>(
      "[data-slot='accordion-trigger']",
    );
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    act(() => triggers[0]?.click());
    expect(onValueChange).toHaveBeenCalled();
  });
});
