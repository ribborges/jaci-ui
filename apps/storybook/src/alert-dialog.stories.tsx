import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertDialog, Button, Text } from "jaci-ui";

const meta = {
  title: "Overlays/AlertDialog",
  tags: ["autodocs"],
  component: AlertDialog.Root,
  parameters: {
    docs: {
      source: {
        code: `<AlertDialog.Root><AlertDialog.Trigger>Delete project</AlertDialog.Trigger><AlertDialog.Portal><AlertDialog.Backdrop /><AlertDialog.Viewport><AlertDialog.Popup><AlertDialog.Title>Delete project?</AlertDialog.Title><AlertDialog.Footer><AlertDialog.Cancel /><AlertDialog.Action>Delete</AlertDialog.Action></AlertDialog.Footer></AlertDialog.Popup></AlertDialog.Viewport></AlertDialog.Portal></AlertDialog.Root>`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup size="sm">
            <AlertDialog.Header>
              <AlertDialog.Title>Delete project?</AlertDialog.Title>
              <AlertDialog.Close />
            </AlertDialog.Header>
            <AlertDialog.Body>
              <AlertDialog.Description>
                This action cannot be undone. All project members will lose access immediately.
              </AlertDialog.Description>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <AlertDialog.Cancel />
              <AlertDialog.Action>Delete project</AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

export const Controlled: Story = {
  render: function ControlledAlertDialog() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open confirmation</Button>
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Portal>
            <AlertDialog.Backdrop />
            <AlertDialog.Viewport>
              <AlertDialog.Popup>
                <AlertDialog.Header>
                  <AlertDialog.Title>Unsaved changes</AlertDialog.Title>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <AlertDialog.Description>
                    You have changes that have not been saved yet.
                  </AlertDialog.Description>
                  <Text style={{ display: "block", marginTop: "1rem" }}>
                    The controlled API leaves the decision in application state.
                  </Text>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Keep editing</AlertDialog.Cancel>
                  <AlertDialog.Action>Discard changes</AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Popup>
            </AlertDialog.Viewport>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    );
  },
};
