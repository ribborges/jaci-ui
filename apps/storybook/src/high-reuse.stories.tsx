import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonGroup, EmptyState, IconButton, Input, InputGroup, Stack } from "jaci-ui";

const meta = {
  title: "Foundations/High reuse components",
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: `<IconButton aria-label="Close">×</IconButton>

<ButtonGroup>
  <Button>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>

<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  <Input aria-label="Website" />
</InputGroup>

<EmptyState.Root>
  <EmptyState.Title>No projects yet</EmptyState.Title>
  <EmptyState.Action><Button>Create project</Button></EmptyState.Action>
</EmptyState.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtons: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm">
      <IconButton aria-label="Close">×</IconButton>
      <IconButton aria-label="Favorite" variant="solid">
        ♥
      </IconButton>
      <IconButton aria-label="Settings" variant="ghost" size="lg">
        ⚙
      </IconButton>
    </Stack>
  ),
};

export const ButtonGroups: Story = {
  render: () => (
    <Stack gap="md">
      <ButtonGroup aria-label="Document actions">
        <Button variant="solid">Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="View actions">
        <Button>Preview</Button>
        <Button>Publish</Button>
      </ButtonGroup>
    </Stack>
  ),
};

export const InputGroups: Story = {
  render: () => (
    <InputGroup.Root style={{ maxWidth: "28rem" }}>
      <InputGroup.Addon>https://</InputGroup.Addon>
      <Input aria-label="Website" placeholder="example.com" />
      <InputGroup.Addon>.com</InputGroup.Addon>
    </InputGroup.Root>
  ),
};

export const EmptyStates: Story = {
  render: () => (
    <EmptyState.Root style={{ maxWidth: "32rem" }}>
      <EmptyState.Icon aria-hidden="true">∅</EmptyState.Icon>
      <EmptyState.Title>No projects yet</EmptyState.Title>
      <EmptyState.Description>
        Start by creating a project. Your recent projects will appear here.
      </EmptyState.Description>
      <EmptyState.Action>
        <Button variant="solid">Create project</Button>
      </EmptyState.Action>
    </EmptyState.Root>
  ),
};
