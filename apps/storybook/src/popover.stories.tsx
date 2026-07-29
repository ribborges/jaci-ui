import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Popover, ThemeProvider } from "jaci-ui";

const meta = {
  title: "Overlays/Popover",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PopoverContent() {
  return (
    <Popover.Portal>
      <Popover.Positioner align="start" side="bottom" sideOffset={8}>
        <Popover.Popup>
          <Popover.Arrow />
          <Popover.Title>Project sharing</Popover.Title>
          <Popover.Description>
            Invite collaborators and control access from this workspace.
          </Popover.Description>
          <Popover.Close />
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Share project</Popover.Trigger>
      <PopoverContent />
    </Popover.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledPopover() {
    const [open, setOpen] = useState(true);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>{open ? "Close sharing" : "Open sharing"}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner align="start" side="bottom" sideOffset={8}>
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>Controlled popover</Popover.Title>
              <Popover.Description>
                The host controls whether this surface is currently open.
              </Popover.Description>
              <Popover.Close onClick={() => setOpen(false)}>Done</Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    );
  },
};

export const KeyboardFocus: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger autoFocus>Focused trigger</Popover.Trigger>
      <PopoverContent />
    </Popover.Root>
  ),
};

export const DarkTheme: Story = {
  render: function ThemedPopover() {
    return (
      <ThemeProvider defaultTheme="dark" style={{ minHeight: "14rem", padding: "2rem" }}>
        <Popover.Root defaultOpen>
          <Popover.Trigger>Workspace details</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner align="start" side="bottom" sideOffset={8}>
              <Popover.Popup>
                <Popover.Arrow />
                <Popover.Title>Dark theme surface</Popover.Title>
                <Popover.Description>
                  The popup keeps its local token values when the portal is scoped.
                </Popover.Description>
                <Popover.Close />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </ThemeProvider>
    );
  },
};
