// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("Calendar", () => {
  it("uses referenceDate for deterministic rendering and selects a day", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <Calendar.Root referenceDate={new Date(2025, 3, 1, 12)} onValueChange={onValueChange}>
        <Calendar.Grid />
      </Calendar.Root>,
    );
    expect(container.querySelector("[data-slot='calendar-day-grid']")).toBeTruthy();
    expect(container.querySelectorAll("[data-slot='calendar-week'][role='row']")).toHaveLength(6);
    expect(
      container.querySelectorAll("[data-slot='calendar-week'] [role='gridcell']"),
    ).toHaveLength(42);
    const day = container.querySelector<HTMLButtonElement>("[data-date='2025-04-15']");
    if (!day) throw new Error("Calendar day was not rendered.");
    act(() => day.click());
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 3, 15, 12));
  });
});
