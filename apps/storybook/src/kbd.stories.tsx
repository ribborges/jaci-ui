import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd, Stack, Text } from "jaci-ui";

const meta = {
  title: "Content/Kbd",
  tags: ["autodocs"],
  component: Kbd,
  args: { children: "⌘K", size: "md", variant: "subtle" },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Kbd {...args} />,
};

export const Shortcut: Story = {
  render: () => (
    <Stack direction="horizontal" align="center" gap="sm">
      <Text>Open command menu</Text>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Stack>
  ),
};
