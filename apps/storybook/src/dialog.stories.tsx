import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dialog, Text } from "jaci-ui";

const meta = {
  title: "Overlays/Dialog",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Header>
              <Dialog.Title>Project details</Dialog.Title>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                The dialog keeps keyboard focus inside while it is open and returns focus to its
                trigger when it closes.
              </Dialog.Description>
              <Text style={{ display: "block", marginTop: "1rem" }}>
                Its default proportions, rounded surface, zinc palette, and close affordance follow
                the original Jaci modal.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>Cancel</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledDialog() {
    const [open, setOpen] = useState(false);

    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>Open controlled dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm">
              <Dialog.Header>
                <Dialog.Title>Controlled API</Dialog.Title>
                <Dialog.Close />
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>
                  Pass open and onOpenChange from application state when external control is needed.
                </Dialog.Description>
              </Dialog.Body>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
};
