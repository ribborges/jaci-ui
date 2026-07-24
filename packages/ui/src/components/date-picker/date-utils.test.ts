import { describe, expect, it } from "vitest";

import {
  createCalendarDate,
  formatDateLabel,
  toInputDateTime,
  toInputMonth,
  toTimeInput,
} from "./date-utils";

describe("DatePicker date utilities", () => {
  const date = createCalendarDate(2025, 3, 15);
  date.setHours(14, 30, 0, 0);

  it("formats values for each granularity", () => {
    expect(formatDateLabel(date, "en-US", "Choose", "day")).toContain("Apr");
    expect(formatDateLabel(date, "en-US", "Choose", "month")).toContain("April");
    expect(formatDateLabel(date, "en-US", "Choose", "date-time")).toContain("2:30");
  });

  it("serializes month and date-time form values", () => {
    expect(toInputMonth(date)).toBe("2025-04");
    expect(toInputDateTime(date)).toBe("2025-04-15T14:30");
    expect(toTimeInput(date)).toBe("14:30");
  });
});
