import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toolbar } from "jaci-ui";

const meta = {
  title: "Navigation/Toolbar",
  tags: ["autodocs"],
  component: Toolbar.Root,
  parameters: {
    docs: {
      source: {
        code: `<Toolbar.Root aria-label="Editor actions"><Toolbar.Button>Bold</Toolbar.Button><Toolbar.Separator /><Toolbar.Input placeholder="Search" /></Toolbar.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toolbar.Root aria-label="Editor actions">
      <Toolbar.Group>
        <Toolbar.Button aria-label="Bold">Bold</Toolbar.Button>
        <Toolbar.Button aria-label="Italic">Italic</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Input aria-label="Search document" placeholder="Search" />
      <Toolbar.Link href="#documentation">Documentation</Toolbar.Link>
    </Toolbar.Root>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Toolbar.Root aria-label="Project actions" orientation="vertical">
      <Toolbar.Button>New project</Toolbar.Button>
      <Toolbar.Button>Duplicate</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Link href="#settings">Settings</Toolbar.Link>
    </Toolbar.Root>
  ),
};
