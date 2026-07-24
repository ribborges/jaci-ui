// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { CheckboxGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("CheckboxGroup", () => {
  it("supports multiple checked values", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <CheckboxGroup.Root defaultValue={[]} onValueChange={onValueChange}>
        <CheckboxGroup.Options>
          <CheckboxGroup.Option>
            <CheckboxGroup.Item value="email">
              <CheckboxGroup.Indicator />
            </CheckboxGroup.Item>
            Email
          </CheckboxGroup.Option>
          <CheckboxGroup.Option>
            <CheckboxGroup.Item value="push">
              <CheckboxGroup.Indicator />
            </CheckboxGroup.Item>
            Push
          </CheckboxGroup.Option>
        </CheckboxGroup.Options>
      </CheckboxGroup.Root>,
    );
    const items = container.querySelectorAll<HTMLElement>("[data-slot='checkbox-group-item']");
    expect(items).toHaveLength(2);
    act(() => items[0]?.click());
    expect(items[0]?.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenCalledWith(["email"]);
  });
});
