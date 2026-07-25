// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { PinInput } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("PinInput", () => {
  it("renders the requested number of fields and distributes paste", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <PinInput.Root length={4} otp onValueChange={onValueChange}>
        <PinInput.Inputs />
      </PinInput.Root>,
    );
    const inputs = [
      ...container.querySelectorAll<HTMLInputElement>("[data-slot='pin-input-input']"),
    ];
    expect(inputs).toHaveLength(4);
    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", { value: { getData: () => "1234" } });
    act(() => inputs[0]?.dispatchEvent(paste));
    expect(onValueChange).toHaveBeenLastCalledWith("1234");
  });
});
