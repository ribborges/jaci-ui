import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, List } from "jaci-ui";

const meta = {
  title: "Data Display/List",
  tags: ["autodocs", "test"],
  component: List.Root,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Divided: Story = {
  render: () => (
    <List.Root variant="divided">
      <List.Item>
        <List.ItemContent>
          <List.ItemTitle>Design system</List.ItemTitle>
          <List.ItemDescription>Tokens and primitives shared by every app.</List.ItemDescription>
        </List.ItemContent>
        <List.ItemAction>
          <Button size="sm">Open</Button>
        </List.ItemAction>
      </List.Item>
      <List.Item selected>
        <List.ItemContent>
          <List.ItemTitle>Documentation</List.ItemTitle>
          <List.ItemDescription>Guides for contributors and consumers.</List.ItemDescription>
        </List.ItemContent>
        <List.ItemAction>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </List.ItemAction>
      </List.Item>
    </List.Root>
  ),
};

export const OrderedCards: Story = {
  render: () => (
    <List.Root density="compact" gap="sm" ordered variant="card">
      <List.Item>
        <List.ItemContent>
          <List.ItemTitle>Install</List.ItemTitle>
          <List.ItemDescription>Add jaci-ui to your app.</List.ItemDescription>
        </List.ItemContent>
      </List.Item>
      <List.Item>
        <List.ItemContent>
          <List.ItemTitle>Theme</List.ItemTitle>
          <List.ItemDescription>Import the static stylesheet once.</List.ItemDescription>
        </List.ItemContent>
      </List.Item>
      <List.Item>
        <List.ItemContent>
          <List.ItemTitle>Compose</List.ItemTitle>
          <List.ItemDescription>Build accessible product surfaces.</List.ItemDescription>
        </List.ItemContent>
      </List.Item>
    </List.Root>
  ),
  parameters: {
    docs: {
      source: {
        language: "tsx",
        code: `<List.Root ordered variant="card" density="compact" gap="sm">
  <List.Item>
    <List.ItemContent>
      <List.ItemTitle>Install</List.ItemTitle>
      <List.ItemDescription>Add jaci-ui to your app.</List.ItemDescription>
    </List.ItemContent>
  </List.Item>
</List.Root>`,
      },
    },
  },
};
