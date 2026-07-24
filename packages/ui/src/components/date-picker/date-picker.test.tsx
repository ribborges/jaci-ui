// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it } from "vitest";

import { DatePicker } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("DatePicker", () => {
  it("opens the calendar from its trigger and keeps the initial date stable", () => {
    const initialDate = new Date(2025, 3, 15, 12);
    const container = renderInDocument(
      <DatePicker.Root defaultValue={initialDate}>
        <DatePicker.Label>Release date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Trigger>
            <DatePicker.Value />
          </DatePicker.Trigger>
          <DatePicker.Clear />
        </DatePicker.Control>
        <DatePicker.Portal>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Header>
                <DatePicker.Previous />
                <DatePicker.Caption />
                <DatePicker.Next />
              </DatePicker.Header>
              <DatePicker.Calendar />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>,
    );
    const trigger = container.querySelector<HTMLButtonElement>("[data-slot='date-picker-trigger']");
    if (!trigger) throw new Error("Date picker trigger was not rendered.");
    expect(trigger.textContent).toContain("15");
    act(() => trigger.click());
    expect(document.querySelector('[data-slot="date-picker-popup"]')).not.toBeNull();
  });
});
