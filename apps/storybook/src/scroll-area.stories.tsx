import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea, Stack, Text } from "jaci-ui";

const meta = {
  title: "Layout/ScrollArea",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const lines = Array.from({ length: 20 }, (_, index) => `Scrollable content line ${index + 1}`);

export const Vertical: Story = {
  render: () => (
    <ScrollArea.Root style={{ height: "14rem", maxWidth: "24rem" }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <Stack gap="sm">
            {lines.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </Stack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea.Root style={{ maxWidth: "22rem" }}>
      <ScrollArea.Viewport>
        <ScrollArea.Content style={{ width: "48rem" }}>
          <Text>Long horizontal content that can be scrolled with the scrollbar.</Text>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
