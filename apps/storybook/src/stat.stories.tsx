import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat, StatGroup } from "jaci-ui";

const meta = {
  title: "Content/Stat",
  tags: ["autodocs"],
  component: Stat.Root,
} satisfies Meta<typeof Stat.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: () => (
    <StatGroup.Root columns={3}>
      <Stat.Root tone="accent">
        <Stat.Label>Active users</Stat.Label>
        <Stat.Value>12,480</Stat.Value>
        <Stat.Description>Across all workspaces</Stat.Description>
        <Stat.Trend direction="up">+12%</Stat.Trend>
      </Stat.Root>
      <Stat.Root tone="success">
        <Stat.Label>Conversion</Stat.Label>
        <Stat.Value>8.4%</Stat.Value>
        <Stat.Description>Compared with last month</Stat.Description>
        <Stat.Trend direction="up">+1.2%</Stat.Trend>
      </Stat.Root>
      <Stat.Root tone="warning">
        <Stat.Label>Pending reviews</Stat.Label>
        <Stat.Value>24</Stat.Value>
        <Stat.Description>Requires attention</Stat.Description>
        <Stat.Trend direction="neutral">No change</Stat.Trend>
      </Stat.Root>
    </StatGroup.Root>
  ),
  parameters: {
    docs: {
      source: {
        code: `<StatGroup.Root columns={3}>
  <Stat.Root tone="success">
    <Stat.Label>Conversion</Stat.Label>
    <Stat.Value>8.4%</Stat.Value>
    <Stat.Trend direction="up">+1.2%</Stat.Trend>
  </Stat.Root>
</StatGroup.Root>`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <StatGroup.Root columns={3}>
      <Stat.Root size="sm">
        <Stat.Label>Small</Stat.Label>
        <Stat.Value>24</Stat.Value>
      </Stat.Root>
      <Stat.Root size="md">
        <Stat.Label>Medium</Stat.Label>
        <Stat.Value>240</Stat.Value>
      </Stat.Root>
      <Stat.Root size="lg">
        <Stat.Label>Large</Stat.Label>
        <Stat.Value>2.4k</Stat.Value>
      </Stat.Root>
    </StatGroup.Root>
  ),
};
