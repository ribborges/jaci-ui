import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex, Separator, Spacer, Stack, Text } from "jaci-ui";

const meta = {
  title: "Foundations/Separator and Spacer",
  tags: ["autodocs"],
  component: Separator,
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Stack gap="md">
      <Text>Section one</Text>
      <Separator />
      <Text>Section two</Text>
    </Stack>
  ),
};
export const Vertical: Story = {
  render: () => (
    <Flex align="center" gap="md" style={{ height: "4rem" }}>
      <Text>Start</Text>
      <Separator orientation="vertical" />
      <Text>End</Text>
    </Flex>
  ),
};
export const Spacing: Story = {
  render: () => (
    <Stack style={{ border: "1px dashed var(--jaci-colors-border-default)", padding: "1rem" }}>
      <Text>Before</Text>
      <Spacer size="lg" />
      <Text>After</Text>
    </Stack>
  ),
  parameters: {
    docs: { source: { code: `<Text>Before</Text>\n<Spacer size="lg" />\n<Text>After</Text>` } },
  },
};
