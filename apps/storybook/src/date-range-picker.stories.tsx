import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker, Text } from "jaci-ui";

const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
const referenceDate = new Date(2025, 3, 15, 12);

function Composition(props: {
  value?: { start: Date | null; end: Date | null };
  onValueChange?: (range: { start: Date | null; end: Date | null }) => void;
}) {
  return (
    <DateRangePicker.Root {...props} referenceDate={referenceDate} name="period">
      <DateRangePicker.Label>Period</DateRangePicker.Label>
      <DateRangePicker.Control>
        <DateRangePicker.Trigger>
          <DateRangePicker.Value />
        </DateRangePicker.Trigger>
        <DateRangePicker.Clear />
      </DateRangePicker.Control>
      <DateRangePicker.Portal>
        <DateRangePicker.Positioner align="start" side="bottom" sideOffset={8}>
          <DateRangePicker.Popup>
            <DateRangePicker.Header>
              <DateRangePicker.Previous />
              <DateRangePicker.MonthSelect />
              <DateRangePicker.YearSelect />
              <DateRangePicker.Next />
            </DateRangePicker.Header>
            <DateRangePicker.Calendar />
            <DateRangePicker.Preview />
            <DateRangePicker.Close>Done</DateRangePicker.Close>
          </DateRangePicker.Popup>
        </DateRangePicker.Positioner>
      </DateRangePicker.Portal>
    </DateRangePicker.Root>
  );
}

export const Default: Story = {
  render: () => <Composition />,
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DateRangePicker.Root defaultValue={{ start: null, end: null }} referenceDate={new Date(2025, 3, 15, 12)} name="period">\n  <DateRangePicker.Label>Period</DateRangePicker.Label>\n  <DateRangePicker.Control><DateRangePicker.Trigger><DateRangePicker.Value /></DateRangePicker.Trigger><DateRangePicker.Clear /></DateRangePicker.Control>\n  <DateRangePicker.Portal><DateRangePicker.Positioner><DateRangePicker.Popup>\n    <DateRangePicker.Header><DateRangePicker.Previous /><DateRangePicker.MonthSelect /><DateRangePicker.YearSelect /><DateRangePicker.Next /></DateRangePicker.Header>\n    <DateRangePicker.Calendar /><DateRangePicker.Preview /><DateRangePicker.Close>Done</DateRangePicker.Close>\n  </DateRangePicker.Popup></DateRangePicker.Positioner></DateRangePicker.Portal>\n</DateRangePicker.Root>`,
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledRange() {
    const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
      start: referenceDate,
      end: null,
    });
    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
        <Composition value={range} onValueChange={setRange} />
        <Text size="sm">
          Start: {range.start?.toLocaleDateString("en-US") ?? "none"} · End:{" "}
          {range.end?.toLocaleDateString("en-US") ?? "none"}
        </Text>
      </div>
    );
  },
};
