import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, Text } from "jaci-ui";

const meta = {
  title: "Forms/Calendar",
  component: Calendar.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

const referenceDate = new Date(2025, 3, 15, 12);

export const Default: Story = {
  render: () => (
    <Calendar.Root
      defaultValue={referenceDate}
      referenceDate={referenceDate}
      locale="en-US"
      weekStartsOn={1}
    >
      <Calendar.Header>
        <Calendar.Previous />
        <Calendar.MonthSelect />
        <Calendar.YearSelect />
        <Calendar.Next />
      </Calendar.Header>
      <Calendar.Grid />
    </Calendar.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<Calendar.Root defaultValue={new Date(2025, 3, 15, 12)} referenceDate={new Date(2025, 3, 1, 12)} locale="en-US" weekStartsOn={1}>
  <Calendar.Header><Calendar.Previous /><Calendar.MonthSelect /><Calendar.YearSelect /><Calendar.Next /></Calendar.Header>
  <Calendar.Grid />
</Calendar.Root>`,
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledCalendar() {
    const [value, setValue] = useState<Date | null>(referenceDate);
    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
        <Calendar.Root value={value} onValueChange={setValue} referenceDate={referenceDate}>
          <Calendar.Header>
            <Calendar.Previous />
            <Calendar.Caption />
            <Calendar.Next />
          </Calendar.Header>
          <Calendar.Grid />
        </Calendar.Root>
        <Text size="sm">Selected: {value?.toLocaleDateString("en-US") ?? "none"}</Text>
      </div>
    );
  },
};
