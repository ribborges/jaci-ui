import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContextMenu, Stack, Text } from "jaci-ui";

const meta = {
  title: "Navigation/ContextMenu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        style={{
          alignItems: "center",
          border: "1px dashed currentColor",
          borderRadius: "0.75rem",
          display: "flex",
          justifyContent: "center",
          minHeight: "10rem",
          padding: "2rem",
          width: "min(100%, 32rem)",
        }}
      >
        Right-click or long-press this surface
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Group>
              <ContextMenu.GroupLabel>Workspace</ContextMenu.GroupLabel>
              <ContextMenu.Item>Rename</ContextMenu.Item>
              <ContextMenu.Item>Duplicate</ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.CheckboxItem defaultChecked>
              <ContextMenu.CheckboxItemIndicator />
              Pin to sidebar
            </ContextMenu.CheckboxItem>
            <ContextMenu.Item disabled>Delete (disabled)</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        style={{
          border: "1px solid currentColor",
          borderRadius: "0.75rem",
          display: "block",
          padding: "3rem",
          width: "min(100%, 32rem)",
        }}
      >
        <Stack gap="sm">
          <Text style={{ fontWeight: 600 }}>Project canvas</Text>
          <Text tone="muted" size="sm">
            Use the context menu to change the canvas view.
          </Text>
        </Stack>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.SubmenuRoot>
              <ContextMenu.SubmenuTrigger>View</ContextMenu.SubmenuTrigger>
              <ContextMenu.Portal>
                <ContextMenu.Positioner>
                  <ContextMenu.Popup>
                    <ContextMenu.Item>Zoom in</ContextMenu.Item>
                    <ContextMenu.Item>Zoom out</ContextMenu.Item>
                  </ContextMenu.Popup>
                </ContextMenu.Positioner>
              </ContextMenu.Portal>
            </ContextMenu.SubmenuRoot>
            <ContextMenu.Item>Copy link</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};
