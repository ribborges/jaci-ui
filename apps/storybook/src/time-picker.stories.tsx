import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Stack, Text, TimePicker } from "jaci-ui";

const meta = {
  title: "Forms/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root name="meeting-time">
      <Field.Label>Meeting time</Field.Label>
      <TimePicker defaultValue="09:30" min="08:00" max="18:00" />
      <Field.Description>Choose a time between 8:00 and 18:00.</Field.Description>
    </Field.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `import { Field, TimePicker } from "jaci-ui";

function MeetingTimeField() {
  return (
    <Field.Root name="meeting-time">
      <Field.Label>Meeting time</Field.Label>
      <TimePicker defaultValue="09:30" min="08:00" max="18:00" />
      <Field.Description>Choose a time between 8:00 and 18:00.</Field.Description>
    </Field.Root>
  );
}`,
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledTimePicker() {
    const [value, setValue] = useState("13:30");
    return (
      <Stack gap="sm" style={{ maxWidth: "20rem" }}>
        <Field.Root>
          <Field.Label>Start time</Field.Label>
          <TimePicker onChange={(event) => setValue(event.currentTarget.value)} value={value} />
        </Field.Root>
        <Text size="sm" tone="muted">
          Selected time: {value}
        </Text>
      </Stack>
    );
  },
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `import { useState } from "react";
import { TimePicker } from "jaci-ui";

function ControlledTimePicker() {
  const [time, setTime] = useState("13:30");
  return (
    <TimePicker
      value={time}
      onChange={(event) => setTime(event.currentTarget.value)}
    />
  );
}`,
      },
    },
  },
};
