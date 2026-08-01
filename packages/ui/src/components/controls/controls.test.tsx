// @vitest-environment jsdom
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, Input, Radio, Switch, Textarea } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("form controls", () => {
  it("preserves native values, loading state and disabled semantics", () => {
    const onCheckedChange = vi.fn();
    const container = renderInDocument(
      <>
        <Input defaultValue="Ada" loading />
        <Textarea defaultValue="Note" disabled />
        <Radio name="plan" value="pro" defaultChecked />
        <Checkbox onCheckedChange={onCheckedChange} />
        <Switch aria-label="Notify" disabled />
      </>,
    );
    expect(container.querySelector<HTMLInputElement>("input[data-slot='input']")?.value).toBe(
      "Ada",
    );
    expect(
      container.querySelector("[data-jaci-component='input']")?.getAttribute("aria-busy"),
    ).toBe("true");
    expect(container.querySelector<HTMLTextAreaElement>("textarea")?.disabled).toBe(true);
    expect(container.querySelector<HTMLInputElement>("input[type='radio']")?.checked).toBe(true);
    const checkbox = container.querySelector<HTMLElement>("[data-slot='checkbox']");
    act(() => checkbox?.click());
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector<HTMLButtonElement>("[data-slot='switch']")?.disabled).toBe(true);
  });
});
