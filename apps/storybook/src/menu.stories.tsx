import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Menu, Text } from "jaci-ui";

const meta = {
  title: "Overlays/Menu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Project actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start" side="bottom" sideOffset={8}>
          <Menu.Popup aria-label="Project actions">
            <Menu.Group>
              <Menu.GroupLabel>Project</Menu.GroupLabel>
              <Menu.Item>Duplicate</Menu.Item>
              <Menu.Item>Share</Menu.Item>
              <Menu.LinkItem href="#project-settings">Project settings</Menu.LinkItem>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Item>Archive project</Menu.Item>
            <Menu.Item disabled>Delete project</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledMenu() {
    const [open, setOpen] = useState(false);

    return (
      <Menu.Root open={open} onOpenChange={setOpen}>
        <Menu.Trigger>{open ? "Close actions" : "Open actions"}</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner align="start" side="bottom" sideOffset={8}>
            <Menu.Popup aria-label="Controlled actions">
              <Menu.Item onClick={() => setOpen(false)}>Save changes</Menu.Item>
              <Menu.Item onClick={() => setOpen(false)}>Discard changes</Menu.Item>
              <Menu.Separator />
              <Text size="sm" tone="muted" style={{ padding: "0.5rem" }}>
                The open state is controlled by the host application.
              </Text>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    );
  },
};
