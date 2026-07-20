import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menubar, Text } from "jaci-ui";

const meta = {
  title: "Navigation/Menubar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceMenubar({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Menubar.Root orientation={orientation}>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>New project</Menubar.Item>
              <Menubar.Item>Open project</Menubar.Item>
              <Menubar.Separator />
              <Menubar.Item>Close</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>Edit</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>Undo</Menubar.Item>
              <Menubar.Item>Redo</Menubar.Item>
              <Menubar.Item>Preferences</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>View</Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Positioner>
            <Menubar.Popup>
              <Menubar.Item>Zoom in</Menubar.Item>
              <Menubar.Item>Zoom out</Menubar.Item>
            </Menubar.Popup>
          </Menubar.Positioner>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}

export const Basic: Story = {
  render: () => <WorkspaceMenubar />,
};

export const Vertical: Story = {
  render: () => (
    <div>
      <WorkspaceMenubar orientation="vertical" />
      <Text tone="muted" size="sm" style={{ display: "block", marginTop: "1rem" }}>
        Arrow keys move between commands; Enter opens the active menu.
      </Text>
    </div>
  ),
};
