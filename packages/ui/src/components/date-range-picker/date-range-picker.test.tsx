// @vitest-environment jsdom

import { act } from "react";
import { describe, expect, it, vi } from "vitest";

import { DateRangePicker } from "../../index";
import { renderInDocument } from "../../test-utils/react";

describe("DateRangePicker", () => {
  it("emits a local range after two selections", () => {
    const onValueChange = vi.fn();
    const container = renderInDocument(
      <DateRangePicker.Root referenceDate={new Date(2025, 3, 1, 12)} onValueChange={onValueChange}>
        <DateRangePicker.Calendar />
      </DateRangePicker.Root>,
    );
    const start = container.querySelector<HTMLButtonElement>("[data-date='2025-04-10']");
    const end = container.querySelector<HTMLButtonElement>("[data-date='2025-04-15']");
    if (!start || !end) throw new Error("Date range days were not rendered.");
    act(() => start.click());
    act(() => end.click());
    expect(onValueChange).toHaveBeenLastCalledWith({
      start: new Date(2025, 3, 10, 12),
      end: new Date(2025, 3, 15, 12),
    });
  });
});
