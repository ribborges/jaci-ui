// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Toggle", () => {
  it("changes uncontrolled pressed state and reports the change", () => {
    const onPressedChange = vi.fn();
    const container = renderInDocument(
      <Toggle defaultPressed={false} onPressedChange={onPressedChange}>
        Preview
      </Toggle>,
    );
    const toggle = container.querySelector<HTMLButtonElement>("[data-slot='toggle']");
    act(() => toggle?.click());
    expect(toggle?.getAttribute("aria-pressed")).toBe("true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
