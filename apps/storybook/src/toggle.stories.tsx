import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stack, Text, Toggle, ToggleGroup } from "jaci-ui";

const meta = {
  title: "Forms/Toggle",
  tags: ["autodocs"],
  component: Toggle,
  parameters: {
    docs: {
      source: { code: `<Toggle pressed={enabled} onPressedChange={setEnabled}>Preview</Toggle>` },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack gap="sm">
      <Toggle>Preview</Toggle>
      <Toggle defaultPressed variant="solid">
        Enabled
      </Toggle>
      <Toggle disabled>Disabled</Toggle>
    </Stack>
  ),
};

export const Controlled: Story = {
  render: function ControlledToggle() {
    const [pressed, setPressed] = useState(false);

    return (
      <Stack gap="sm">
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          {pressed ? "Preview enabled" : "Preview disabled"}
        </Toggle>
        <Text size="sm" tone="muted">
          Press Enter or Space to toggle.
        </Text>
      </Stack>
    );
  },
};

export const Group: Story = {
  render: function ToggleGroupStory() {
    const [value, setValue] = useState(["grid"]);

    return (
      <Stack gap="md">
        <ToggleGroup.Root value={value} multiple onValueChange={setValue}>
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="list">List</ToggleGroup.Item>
          <ToggleGroup.Item value="compact">Compact</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Text size="sm" tone="muted">
          Selected: {value.join(", ") || "none"}
        </Text>
      </Stack>
    );
  },
};

export const VerticalGroup: Story = {
  render: () => (
    <ToggleGroup.Root orientation="vertical" aria-label="View options">
      <ToggleGroup.Item value="overview">Overview</ToggleGroup.Item>
      <ToggleGroup.Item value="activity">Activity</ToggleGroup.Item>
      <ToggleGroup.Item value="settings">Settings</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
