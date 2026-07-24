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
}: {
  defaultValue?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  maxDate?: Date;
  minDate?: Date;
}) {
  return (
    <DatePicker.Root
      defaultValue={defaultValue}
      name="release-date"
      weekStartsOn={1}
      {...(maxDate ? { maxDate } : {})}
      {...(isDateDisabled ? { isDateDisabled } : {})}
      {...(minDate ? { minDate } : {})}
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
              <DatePicker.Caption />
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
          <DatePicker.Caption />
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
                  <DatePicker.Caption />
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
          <DatePicker.Caption />
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
          <DatePicker.Caption />
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
