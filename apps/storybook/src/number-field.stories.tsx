import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NumberField, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/NumberField",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NumberField.Root defaultValue={2} max={10} min={0} name="seats" step={1}>
      <NumberField.Label>Seats</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input aria-label="Seats" />
        <NumberField.Increment />
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const Decimal: Story = {
  render: () => (
    <NumberField.Root defaultValue={12.5} format={{ maximumFractionDigits: 2 }} step={0.5}>
      <NumberField.Label>Budget</NumberField.Label>
      <NumberField.Group>
        <NumberField.Decrement />
        <NumberField.Input aria-label="Budget" />
        <NumberField.Increment />
      </NumberField.Group>
      <Text size="sm" tone="muted">
        Supports locale-aware formatting and keyboard stepping.
      </Text>
    </NumberField.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledNumberField() {
    const [value, setValue] = useState<number | null>(4);

    return (
      <Stack gap="sm" style={{ minWidth: "16rem" }}>
        <NumberField.Root value={value} max={20} min={0} onValueChange={setValue}>
          <NumberField.Label>Team members</NumberField.Label>
          <NumberField.Group>
            <NumberField.Decrement aria-label="Remove member" />
            <NumberField.Input aria-label="Team members" />
            <NumberField.Increment aria-label="Add member" />
          </NumberField.Group>
        </NumberField.Root>
        <Text size="sm" tone="muted">
          Controlled value: {value ?? "empty"}
        </Text>
      </Stack>
    );
  },
};
