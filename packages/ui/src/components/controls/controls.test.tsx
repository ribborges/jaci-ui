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
    expect(container.querySelector("[data-slot='input-password-toggle']")).toBeNull();
    expect(container.querySelector<HTMLTextAreaElement>("textarea")?.disabled).toBe(true);
    expect(container.querySelector<HTMLInputElement>("input[type='radio']")?.checked).toBe(true);
    const checkbox = container.querySelector<HTMLElement>("[data-slot='checkbox']");
    act(() => checkbox?.click());
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector<HTMLButtonElement>("[data-slot='switch']")?.disabled).toBe(true);
  });

  it("toggles password visibility without changing the input value", () => {
    const container = renderInDocument(
      <Input aria-label="Password" defaultValue="secret" type="password" />,
    );
    const input = container.querySelector<HTMLInputElement>("input[data-slot='input']");
    const toggle = container.querySelector<HTMLButtonElement>(
      "[data-slot='input-password-toggle']",
    );
    if (!input || !toggle) throw new Error("Password input and its toggle were not rendered.");

    expect(input.type).toBe("password");
    expect(toggle.getAttribute("aria-label")).toBe("Show password");
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    act(() => toggle.click());
    expect(input.type).toBe("text");
    expect(input.value).toBe("secret");
    expect(toggle.getAttribute("aria-label")).toBe("Hide password");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
  });

  it("disables the password visibility toggle with the input", () => {
    const container = renderInDocument(<Input disabled type="password" />);
    expect(
      container.querySelector<HTMLButtonElement>("[data-slot='input-password-toggle']")?.disabled,
    ).toBe(true);
  });
});
