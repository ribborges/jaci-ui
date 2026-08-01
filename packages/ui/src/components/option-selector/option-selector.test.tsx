// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { OptionSelector } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("OptionSelector", () => {
  it("updates multiple uncontrolled values and leaves disabled options unavailable", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <OptionSelector
        multiple
        defaultValue={["email"]}
        onValueChange={onValueChange}
        options={[
          { label: "Email", value: "email" },
          { label: "Push", value: "push" },
          { disabled: true, label: "SMS", value: "sms" },
        ]}
      />,
    );
    const inputs = container.querySelectorAll<HTMLInputElement>(
      "[data-slot='option-selector-input']",
    );
    expect(inputs[0]?.checked).toBe(true);
    expect(inputs[2]?.disabled).toBe(true);
    act(() => inputs[1]?.click());
    expect(onValueChange).toHaveBeenCalledWith(["email", "push"]);
  });
});
