// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("RadioGroup", () => {
  it("keeps one selected option and reports its value", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <RadioGroup.Root defaultValue="starter" onValueChange={onValueChange}>
        <RadioGroup.Options>
          <RadioGroup.Option>
            <RadioGroup.Item value="starter">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            Starter
          </RadioGroup.Option>
          <RadioGroup.Option>
            <RadioGroup.Item value="pro">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            Pro
          </RadioGroup.Option>
        </RadioGroup.Options>
      </RadioGroup.Root>,
    );
    const items = container.querySelectorAll<HTMLElement>("[data-slot='radio-group-item']");
    expect(items[0]?.getAttribute("aria-checked")).toBe("true");
    act(() => items[1]?.click());
    expect(items[0]?.getAttribute("aria-checked")).toBe("false");
    expect(items[1]?.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange.mock.calls[0]?.[0]).toBe("pro");
  });
});
