import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, Collapsible, Stack, Text } from "jaci-ui";

const meta = {
  title: "Disclosure/Accordion",
  tags: ["autodocs"],
  component: Accordion.Root,
  parameters: {
    docs: {
      source: {
        code: `<Accordion.Root><Accordion.Item value="installation"><Accordion.Header><Accordion.Trigger>How do I install?</Accordion.Trigger></Accordion.Header><Accordion.Panel>Install jaci-ui.</Accordion.Panel></Accordion.Item></Accordion.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion.Root defaultValue={["installation"]} style={{ maxWidth: "42rem" }}>
      <Accordion.Item value="installation">
        <Accordion.Header>
          <Accordion.Trigger>How do I install Jaci UI?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Text tone="muted">Install the package, then import jaci-ui/styles.css once.</Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="themes">
        <Accordion.Header>
          <Accordion.Trigger>How do themes work?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Text tone="muted">Set data-jaci-theme on an application or local wrapper.</Text>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="disabled" disabled>
        <Accordion.Header>
          <Accordion.Trigger>Unavailable item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <Text>This panel is disabled.</Text>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const MultipleAndCollapsible: Story = {
  render: () => (
    <Stack style={{ maxWidth: "42rem" }}>
      <Accordion.Root defaultValue={["first", "second"]} multiple>
        <Accordion.Item value="first">
          <Accordion.Header>
            <Accordion.Trigger>First open item</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <Text tone="muted">More than one item can remain open.</Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="second">
          <Accordion.Header>
            <Accordion.Trigger>Second open item</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <Text tone="muted">The chevron follows the Base UI open state.</Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <Collapsible.Root>
        <Collapsible.Trigger>Show implementation note</Collapsible.Trigger>
        <Collapsible.Panel>
          <Text tone="muted">
            Collapsible is ideal for one independent disclosure, while Accordion coordinates a group
            of items.
          </Text>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Stack>
  ),
};
