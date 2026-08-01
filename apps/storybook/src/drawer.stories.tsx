import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, Stack, Text } from "jaci-ui";

const meta = {
  title: "Overlays/Drawer",
  tags: ["autodocs"],
  component: Drawer.Root,
  parameters: {
    docs: {
      source: {
        code: `<Drawer.Root><Drawer.Trigger>Open drawer</Drawer.Trigger><Drawer.Portal><Drawer.Backdrop /><Drawer.Viewport><Drawer.Popup><Drawer.Title>Navigation</Drawer.Title><Drawer.Content>Content</Drawer.Content><Drawer.Close /></Drawer.Popup></Drawer.Viewport></Drawer.Portal></Drawer.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerExample({
  side = "bottom" as const,
}: {
  side?: "bottom" | "left" | "right" | "top";
}) {
  return (
    <Drawer.Root
      defaultOpen={false}
      side={side}
      {...(side === "bottom" ? { snapPoints: ["35rem", 1] as const } : {})}
    >
      <Drawer.Trigger>Open {side} drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Header>
              <div>
                <Drawer.Title>Workspace navigation</Drawer.Title>
                <Drawer.Description>Swipe or press Escape to close this panel.</Drawer.Description>
              </div>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Content>
              <Stack gap="sm">
                <Text>Drawer content remains scrollable and preserves focus management.</Text>
                <Text tone="muted" size="sm">
                  Side, size, snap points, and controlled open state can all be configured.
                </Text>
              </Stack>
            </Drawer.Content>
            <Drawer.Footer>
              <Drawer.Close>Done</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export const Bottom: Story = {
  render: () => <DrawerExample />,
};

export const Right: Story = {
  render: () => <DrawerExample side="right" />,
};

export const Controlled: Story = {
  render: function ControlledDrawer() {
    const [open, setOpen] = useState(false);

    return (
      <Drawer.Root open={open} onOpenChange={setOpen} side="left" size="sm">
        <Drawer.Trigger>Open controlled drawer</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <Drawer.Header>
                <Drawer.Title>Controlled drawer</Drawer.Title>
                <Drawer.Close />
              </Drawer.Header>
              <Drawer.Content>
                <Text>The drawer is controlled by the parent component.</Text>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    );
  },
};
