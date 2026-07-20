import type { Meta, StoryObj } from "@storybook/react-vite";

import { Copyable, Stack, Text } from "jaci-ui";

const meta = {
  title: "Feedback/Copyable",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InstallationCommand: Story = {
  render: () => (
    <Stack gap="sm">
      <Text size="sm" tone="muted">
        Click the command to copy it.
      </Text>
      <Copyable.Root aria-label="Copy installation command" value="pnpm add jaci-ui">
        <Copyable.Content>pnpm add jaci-ui</Copyable.Content>
        <Copyable.Indicator />
      </Copyable.Root>
    </Stack>
  ),
};

export const InlineCode: Story = {
  render: () => (
    <Copyable.Root aria-label="Copy import statement" value='import { Button } from "jaci-ui"'>
      <Copyable.Content as="span">
        import {"{"} Button {"}"} from "jaci-ui"
      </Copyable.Content>
      <Copyable.Indicator>Copy code</Copyable.Indicator>
    </Copyable.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Copyable.Root disabled value="This command is currently unavailable">
      <Copyable.Content>This command is currently unavailable</Copyable.Content>
      <Copyable.Indicator />
    </Copyable.Root>
  ),
};
