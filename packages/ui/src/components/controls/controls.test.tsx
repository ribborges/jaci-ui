// @vitest-environment jsdom
import { act, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, Input, Radio, Switch, Textarea, TimePicker } from "../../index";
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

  it("renders a native time input with shared input styles and native constraints", () => {
    const ref = { current: null as HTMLInputElement | null };
    const container = renderInDocument(
      <>
        <Input aria-label="Reference input" />
        <TimePicker
          ref={ref}
          aria-label="Start time"
          defaultValue="09:30"
          disabled
          max="18:00"
          min="08:00"
          step={900}
        />
      </>,
    );
    const input = container.querySelector<HTMLInputElement>("input[type='time']");
    const reference = container.querySelector<HTMLInputElement>(
      "input[data-slot='input']:not([type])",
    );
    if (!input || !reference) throw new Error("TimePicker and Input did not render.");

    expect(input.value).toBe("09:30");
    expect(input.min).toBe("08:00");
    expect(input.max).toBe("18:00");
    expect(input.step).toBe("900");
    expect(input.disabled).toBe(true);
    expect(input.className).toBe(reference.className);
    expect(ref.current).toBe(input);
  });

  it("updates a controlled time value and reports native change events", () => {
    const onValueChange = vi.fn();
    function ControlledTimePicker() {
      const [value, setValue] = useState("09:30");
      return (
        <TimePicker
          aria-label="Meeting time"
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
            setValue(event.currentTarget.value);
          }}
          value={value}
        />
      );
    }

    const container = renderInDocument(<ControlledTimePicker />);
    const input = container.querySelector<HTMLInputElement>("input[type='time']");
    if (!input) throw new Error("Controlled TimePicker did not render.");

    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    act(() => {
      setter?.call(input, "10:15");
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onValueChange).toHaveBeenCalledWith("10:15");
    expect(input.value).toBe("10:15");
  });
});
