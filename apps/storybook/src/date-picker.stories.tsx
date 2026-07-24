import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialDate = new Date(2025, 3, 15, 12, 0, 0, 0);

function PickerComposition({
  defaultValue = initialDate,
  isDateDisabled,
  maxDate,
  minDate,
  yearRange,
}: {
  defaultValue?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  maxDate?: Date;
  minDate?: Date;
  yearRange?: { start: number; end: number };
}) {
  return (
    <DatePicker.Root
      defaultValue={defaultValue}
      name="release-date"
      weekStartsOn={1}
      {...(maxDate ? { maxDate } : {})}
      {...(isDateDisabled ? { isDateDisabled } : {})}
      {...(minDate ? { minDate } : {})}
      {...(yearRange ? { yearRange } : {})}
    >
      <DatePicker.Label>Release date</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Trigger>
          <DatePicker.Value placeholder="Choose a date" />
        </DatePicker.Trigger>
        <DatePicker.Clear />
      </DatePicker.Control>
      <DatePicker.Portal>
        <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
          <DatePicker.Popup>
            <DatePicker.Header>
              <DatePicker.Previous />
              <DatePicker.MonthSelect />
              <DatePicker.YearSelect />
              <DatePicker.Next />
            </DatePicker.Header>
            <DatePicker.Calendar />
          </DatePicker.Popup>
        </DatePicker.Positioner>
      </DatePicker.Portal>
    </DatePicker.Root>
  );
}

export const Calendar: Story = {
  render: () => (
    <Stack gap="sm" style={{ minWidth: "20rem" }}>
      <PickerComposition />
      <Text size="sm" tone="muted">
        Use the arrow keys inside the calendar to move focus, Page Up/Down to change months, and
        Enter to select a day.
      </Text>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root defaultValue={new Date(2025, 3, 15, 12)} name="release-date">
  <DatePicker.Label>Release date</DatePicker.Label>
  <DatePicker.Control>
    <DatePicker.Trigger>
      <DatePicker.Value placeholder="Choose a date" />
    </DatePicker.Trigger>
    <DatePicker.Clear />
  </DatePicker.Control>
  <DatePicker.Portal>
    <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
      <DatePicker.Popup>
        <DatePicker.Header>
          <DatePicker.Previous />
          <DatePicker.MonthSelect />
          <DatePicker.YearSelect />
          <DatePicker.Next />
        </DatePicker.Header>
        <DatePicker.Calendar />
      </DatePicker.Popup>
    </DatePicker.Positioner>
  </DatePicker.Portal>
</DatePicker.Root>`,
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState<Date | null>(initialDate);

    return (
      <Stack gap="sm" style={{ minWidth: "20rem" }}>
        <DatePicker.Root value={value} onValueChange={setValue} weekStartsOn={1}>
          <DatePicker.Label>Controlled date</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Trigger>
              <DatePicker.Value placeholder="Choose a date" />
            </DatePicker.Trigger>
            <DatePicker.Clear />
          </DatePicker.Control>
          <DatePicker.Portal>
            <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
              <DatePicker.Popup>
                <DatePicker.Header>
                  <DatePicker.Previous />
                  <DatePicker.MonthSelect />
                  <DatePicker.YearSelect />
                  <DatePicker.Next />
                </DatePicker.Header>
                <DatePicker.Calendar />
              </DatePicker.Popup>
            </DatePicker.Positioner>
          </DatePicker.Portal>
        </DatePicker.Root>
        <Text size="sm" tone="muted">
          Selected: {value?.toLocaleDateString("pt-BR") ?? "none"}
        </Text>
      </Stack>
    );
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `const [value, setValue] = useState<Date | null>(new Date());

<DatePicker.Root value={value} onValueChange={setValue}>
  <DatePicker.Label>Controlled date</DatePicker.Label>
  <DatePicker.Control>
    <DatePicker.Trigger>
      <DatePicker.Value placeholder="Choose a date" />
    </DatePicker.Trigger>
    <DatePicker.Clear />
  </DatePicker.Control>
  <DatePicker.Portal>
    <DatePicker.Positioner>
      <DatePicker.Popup>
        <DatePicker.Header>
          <DatePicker.Previous />
          <DatePicker.MonthSelect />
          <DatePicker.YearSelect />
          <DatePicker.Next />
        </DatePicker.Header>
        <DatePicker.Calendar />
      </DatePicker.Popup>
    </DatePicker.Positioner>
  </DatePicker.Portal>
</DatePicker.Root>`,
      },
    },
  },
};

export const DisabledDates: Story = {
  render: () => (
    <PickerComposition
      defaultValue={null}
      isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root
  defaultValue={null}
  isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
>
  {/* compose the Label, Control, Portal, Popup and Calendar parts */}
</DatePicker.Root>`,
      },
    },
  },
};

export const BoundedCalendar: Story = {
  render: () => (
    <PickerComposition
      defaultValue={null}
      isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
      maxDate={new Date(2025, 3, 30, 12, 0, 0, 0)}
      minDate={new Date(2025, 3, 7, 12, 0, 0, 0)}
    />
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root
  defaultValue={null}
  minDate={new Date(2025, 3, 7, 12)}
  maxDate={new Date(2025, 3, 30, 12)}
  isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
>
  <DatePicker.Label>Release date</DatePicker.Label>
  <DatePicker.Control>
    <DatePicker.Trigger>
      <DatePicker.Value placeholder="Choose a date" />
    </DatePicker.Trigger>
    <DatePicker.Clear />
  </DatePicker.Control>
  <DatePicker.Portal>
    <DatePicker.Positioner>
      <DatePicker.Popup>
        <DatePicker.Header>
          <DatePicker.Previous />
          <DatePicker.MonthSelect />
          <DatePicker.YearSelect />
          <DatePicker.Next />
        </DatePicker.Header>
        <DatePicker.Calendar />
      </DatePicker.Popup>
    </DatePicker.Positioner>
  </DatePicker.Portal>
</DatePicker.Root>`,
      },
    },
  },
};

export const MonthOnly: Story = {
  render: () => (
    <Stack gap="sm" style={{ minWidth: "20rem" }}>
      <DatePicker.Root
        granularity="month"
        name="billing-month"
        yearRange={{ end: 2035, start: 2020 }}
      >
        <DatePicker.Label>Billing month</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Trigger>
            <DatePicker.Value placeholder="Choose a month" />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Portal>
          <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
            <DatePicker.Popup>
              <DatePicker.Header>
                <DatePicker.Previous />
                <DatePicker.MonthSelect />
                <DatePicker.YearSelect />
                <DatePicker.Next />
              </DatePicker.Header>
              <DatePicker.Calendar />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>
      <Text size="sm" tone="muted">
        The selected value is normalized to the first day of the month.
      </Text>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root granularity="month" yearRange={{ start: 2020, end: 2035 }}>
  <DatePicker.Trigger><DatePicker.Value placeholder="Choose a month" /></DatePicker.Trigger>
  <DatePicker.Portal><DatePicker.Positioner><DatePicker.Popup>
    <DatePicker.Header><DatePicker.Previous /><DatePicker.MonthSelect /><DatePicker.YearSelect /><DatePicker.Next /></DatePicker.Header>
    <DatePicker.Calendar />
  </DatePicker.Popup></DatePicker.Positioner></DatePicker.Portal>
</DatePicker.Root>`,
      },
    },
  },
};

export const DateTime: Story = {
  render: () => (
    <Stack gap="sm" style={{ minWidth: "20rem" }}>
      <DatePicker.Root
        defaultValue={new Date(2025, 3, 15, 14, 30)}
        granularity="date-time"
        name="meeting-at"
      >
        <DatePicker.Label>Meeting time</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Trigger>
            <DatePicker.Value />
          </DatePicker.Trigger>
        </DatePicker.Control>
        <DatePicker.Portal>
          <DatePicker.Positioner align="start" side="bottom" sideOffset={8}>
            <DatePicker.Popup>
              <DatePicker.Header>
                <DatePicker.Previous />
                <DatePicker.MonthSelect />
                <DatePicker.YearSelect />
                <DatePicker.Next />
              </DatePicker.Header>
              <DatePicker.Calendar />
              <DatePicker.TimeField />
              <DatePicker.Close>Done</DatePicker.Close>
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>
      <Text size="sm" tone="muted">
        Date and time mode keeps the popup open until Done is pressed.
      </Text>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root granularity="date-time" defaultValue={new Date(2025, 3, 15, 14, 30)}>
  <DatePicker.Trigger><DatePicker.Value /></DatePicker.Trigger>
  <DatePicker.Portal><DatePicker.Positioner><DatePicker.Popup>
    <DatePicker.Header><DatePicker.Previous /><DatePicker.MonthSelect /><DatePicker.YearSelect /><DatePicker.Next /></DatePicker.Header>
    <DatePicker.Calendar />
    <DatePicker.TimeField />
    <DatePicker.Close>Done</DatePicker.Close>
  </DatePicker.Popup></DatePicker.Positioner></DatePicker.Portal>
</DatePicker.Root>`,
      },
    },
  },
};

export const BirthDate: Story = {
  render: () => (
    <PickerComposition
      defaultValue={null}
      maxDate={new Date(2026, 11, 31, 12)}
      minDate={new Date(1900, 0, 1, 12)}
      yearRange={{ end: 2026, start: 1900 }}
    />
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<DatePicker.Root
  yearRange={{ start: 1900, end: 2026 }}
  minDate={new Date(1900, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
/>`,
      },
    },
  },
};

export const DarkTheme: Story = {
  render: () => (
    <div data-jaci-theme="dark" style={{ padding: "1.5rem" }}>
      <PickerComposition />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div data-jaci-theme="dark">
  <DatePicker.Root defaultValue={new Date(2025, 3, 15, 12)}>
    <DatePicker.Trigger><DatePicker.Value /></DatePicker.Trigger>
    {/* compose the Portal, Positioner, Popup, Header and Calendar parts */}
  </DatePicker.Root>
</div>`,
        language: "tsx",
      },
    },
  },
};
