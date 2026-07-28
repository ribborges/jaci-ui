import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code, Copyable, Stack } from "jaci-ui";

const meta = {
  title: "Content/Code",
  tags: ["autodocs"],
  component: Code,
  args: { children: "pnpm add jaci-ui", variant: "inline" },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {};

export const Block: Story = {
  args: {
    children: 'import { Button } from "jaci-ui";\n\n<Button>Save</Button>',
    language: "tsx",
    variant: "block",
    wrap: true,
  },
  parameters: {
    docs: { source: { code: '<Code variant="block" language="tsx" wrap>{source}</Code>' } },
  },
};

export const WithCopyable: Story = {
  render: () => (
    <Stack style={{ maxWidth: "32rem" }}>
      <Copyable.Root value="pnpm add jaci-ui">
        <Copyable.Content as="code">pnpm add jaci-ui</Copyable.Content>
        <Copyable.Indicator />
      </Copyable.Root>
    </Stack>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Copyable.Root value="pnpm add jaci-ui">
  <Copyable.Content as="code">pnpm add jaci-ui</Copyable.Content>
  <Copyable.Indicator />
</Copyable.Root>`,
      },
    },
  },
};
