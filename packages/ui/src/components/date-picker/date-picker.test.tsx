// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "../../index";
import { renderInDocument } from "../../test-utils/react";

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("DatePicker advanced modes", () => {
  it("selects a month and normalizes the value to its first day", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <DatePicker.Root
        defaultValue={new Date(2025, 3, 15, 12)}
        granularity="month"
        onValueChange={onValueChange}
      >
        <DatePicker.MonthSelect />
        <DatePicker.YearSelect />
        <DatePicker.Calendar />
      </DatePicker.Root>,
    );

    const month = container.querySelector<HTMLSelectElement>(
      '[data-slot="date-picker-month-select"]',
    );
    const monthButtons = container.querySelectorAll<HTMLButtonElement>(
      '[data-slot="date-picker-month"]',
    );
    if (!month || monthButtons.length !== 12)
      throw new Error("Month mode did not render controls.");

    act(() => monthButtons[0]?.click());

    const value = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect(value.getDate()).toBe(1);
    expect(value.getMonth()).toBe(0);
    expect(month.value).toBe("0");
  });

  it("updates the time field and serializes date-time values", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <DatePicker.Root
        defaultValue={new Date(2025, 3, 15, 14, 30)}
        granularity="date-time"
        name="meeting-at"
        onValueChange={onValueChange}
      >
        <DatePicker.TimeField />
      </DatePicker.Root>,
    );

    const time = container.querySelector<HTMLInputElement>('[data-slot="date-picker-time-field"]');
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]');
    if (!time || !hidden) throw new Error("Date-time controls did not render.");

    act(() => setInputValue(time, "16:45"));

    const value = onValueChange.mock.calls.at(-1)?.[0] as Date;
    expect(value.getHours()).toBe(16);
    expect(value.getMinutes()).toBe(45);
    expect(hidden.value).toBe("2025-04-15T16:45");
  });

  it("clamps date-time selection to time boundaries on the selected day", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <DatePicker.Root
        defaultValue={new Date(2025, 3, 15, 8, 0)}
        granularity="date-time"
        maxDate={new Date(2025, 3, 15, 18, 0)}
        minDate={new Date(2025, 3, 15, 9, 30)}
        onValueChange={onValueChange}
      >
        <DatePicker.TimeField />
      </DatePicker.Root>,
    );

    const time = container.querySelector<HTMLInputElement>('[data-slot="date-picker-time-field"]');
    if (!time) throw new Error("Date-time control did not render.");

    act(() => setInputValue(time, "08:00"));
    expect(onValueChange).not.toHaveBeenCalled();

    act(() => setInputValue(time, "10:00"));
    expect(onValueChange.mock.calls.at(-1)?.[0]?.getHours()).toBe(10);
  });
});
