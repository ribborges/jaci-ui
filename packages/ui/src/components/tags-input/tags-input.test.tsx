// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { TagsInput } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("TagsInput", () => {
  it("suggests, adds and removes tags through the themed control", () => {
    const onTagsChange = vi.fn();
    const container = renderInDocument(
      <TagsInput
        data={["React", "TypeScript"]}
        defaultTags={["React"]}
        label="Technologies"
        onTagsChange={onTagsChange}
      />,
    );

    const input = container.querySelector<HTMLInputElement>("input");
    if (!input) throw new Error("TagsInput did not render its input.");
    expect(container.querySelectorAll('[data-slot="tags-input-tag"]')).toHaveLength(1);

    act(() => input.focus());
    expect(container.querySelector('[data-slot="tags-input-item"]')?.textContent).toBe(
      "TypeScript",
    );
    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeSetter?.call(input, "TypeScript,");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(container.querySelectorAll('[data-slot="tags-input-tag"]')).toHaveLength(2);
    expect(onTagsChange).toHaveBeenLastCalledWith(["React", "TypeScript"]);

    const remove = container.querySelector<HTMLButtonElement>(
      '[data-slot="tags-input-tag-remove"]',
    );
    if (!remove) throw new Error("TagsInput did not render a remove action.");
    act(() => remove.click());
    expect(container.querySelectorAll('[data-slot="tags-input-tag"]')).toHaveLength(1);
    expect(onTagsChange).toHaveBeenLastCalledWith(["TypeScript"]);
  });
});
