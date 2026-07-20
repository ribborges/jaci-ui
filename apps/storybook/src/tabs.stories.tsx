import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, Text } from "jaci-ui";

const meta = {
  title: "Navigation/Tabs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {
  render: () => (
    <Tabs.Root defaultValue="projects">
      <Tabs.List aria-label="Portfolio sections">
        <Tabs.Tab value="projects">Projects</Tabs.Tab>
        <Tabs.Tab value="writing">Writing</Tabs.Tab>
        <Tabs.Tab value="saved" disabled>
          Saved
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="projects">
        <Text>Selected content appears in an accessible tab panel.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="writing">
        <Text>Use arrow keys to move through the tab buttons.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="saved">
        <Text>This unavailable section is intentionally disabled.</Text>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const Pills: Story = {
  render: () => (
    <Tabs.Root defaultValue="all" variant="pills">
      <Tabs.List aria-label="Filter projects">
        <Tabs.Tab value="all">All</Tabs.Tab>
        <Tabs.Tab value="web">Web</Tabs.Tab>
        <Tabs.Tab value="mobile">Mobile</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="all">
        <Text>All projects.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="web">
        <Text>Web projects.</Text>
      </Tabs.Panel>
      <Tabs.Panel value="mobile">
        <Text>Mobile projects.</Text>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};
