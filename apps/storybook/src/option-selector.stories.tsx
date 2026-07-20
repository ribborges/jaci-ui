import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OptionSelector, Stack, Text } from "jaci-ui";

const meta = {
  title: "Forms/OptionSelector",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const planOptions = [
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
];

export const Single: Story = {
  render: () => (
    <OptionSelector
      defaultValue="pro"
      description="Choose the plan that best fits this workspace."
      icon="◆"
      label="Workspace plan"
      name="plan"
      options={planOptions}
    />
  ),
};

export const Multiple: Story = {
  render: function MultipleStory() {
    const [value, setValue] = useState<string[]>(["email"]);

    return (
      <Stack gap="sm" style={{ minWidth: "22rem" }}>
        <OptionSelector
          description="Select every channel you want to receive."
          label="Notifications"
          multiple
          name="notifications"
          onValueChange={(nextValue) => setValue(nextValue as string[])}
          options={[
            { children: <span aria-hidden="true">✉</span>, label: "Email", value: "email" },
            { children: <span aria-hidden="true">▣</span>, label: "SMS", value: "sms" },
            { children: <span aria-hidden="true">◌</span>, label: "Push", value: "push" },
          ]}
          value={value}
        />
        <Text size="sm" tone="muted">
          Selected: {value.length > 0 ? value.join(", ") : "none"}
        </Text>
      </Stack>
    );
  },
};

export const VerticalAndDisabled: Story = {
  render: () => (
    <OptionSelector
      columns={2}
      label="Deployment target"
      orientation="vertical"
      options={[
        { label: "Production", value: "production" },
        { disabled: true, label: "Preview (coming soon)", value: "preview" },
        { label: "Development", value: "development" },
      ]}
    />
  ),
};
